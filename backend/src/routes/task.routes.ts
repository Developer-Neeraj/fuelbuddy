import { FastifyInstance } from 'fastify';
import { Type } from '@sinclair/typebox';
import { pool } from '../config/database';
import { users, CreateTaskInput, UpdateTaskInput } from '../types/task';

export async function taskRoutes(fastify: FastifyInstance) {
  fastify.post<{ Body: users }>('/register', async (request, reply) => {
    const { username, email, firebaseuserid } = request.body;
    const client = await pool.connect();
    try {
      const result = await client.query(
        'INSERT INTO users (username, email, firebaseuser) VALUES ($1, $2, $3) RETURNING *',
        [username, email, firebaseuserid]
      );
      return reply.status(201).send(result.rows[0]);
    } finally {
      client.release();
    }
  });

  fastify.post('/searchtask/:id', async (request, reply) => {
    const { id } = request.params as { id : string };
    const { filter } = request.body;
    const client = await pool.connect();
    try {
      if(filter == 'all') {
        const result = await client.query(`
          SELECT t.id, t.title, t.description, 
          u1.username AS creator_name, 
          u2.username AS shared_with_name, t.created_at 
          FROM tasks t 
          Left JOIN users u1 ON t.user_id = u1.firebaseuser 
          left JOIN users u2 ON t.shareid = u2.firebaseuser 
          WHERE t.user_id = $1 OR t.shareid = $1 ORDER BY t.created_at DESC;`, [id]);
        return reply.send(result.rows);
      }
      if(filter == 'Shared') {
        const result = await client.query(`
          SELECT t.id, t.title, t.description, 
          u1.username AS creator_name, 
          u2.username AS shared_with_name, t.created_at 
          FROM tasks t 
          Left JOIN users u1 ON t.user_id = u1.firebaseuser 
          left JOIN users u2 ON t.shareid = u2.firebaseuser 
          WHERE t.shareid = $1 ORDER BY t.created_at DESC;`, [id]);
        return reply.send(result.rows);
      }
      if(filter == 'Self') {
        const result = await client.query(`
          SELECT t.id, t.title, t.description, 
          u1.username AS creator_name, 
          u2.username AS shared_with_name, t.created_at 
          FROM tasks t 
          Left JOIN users u1 ON t.user_id = u1.firebaseuser 
          left JOIN users u2 ON t.shareid = u2.firebaseuser 
          WHERE t.user_id = $1 ORDER BY t.created_at DESC;`, [id]);
        return reply.send(result.rows);
      }
    } finally {
      client.release();
    }
  });

  // Get all tasks
  fastify.get('/allusers/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT * FROM users where firebaseuser != $1 ORDER BY created_at DESC', [id]);
      return reply.send(result.rows);
    } finally {
      client.release();
    }
  });

  // Get user by ID
  fastify.get('/users/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT * FROM users WHERE firebaseuser = $1', [id]);
      if (result.rows.length === 0) {
        return reply.status(404).send({ message: 'user not found' });
      }
      return reply.send(result.rows[0]);
    } finally {
      client.release();
    }
  });

  // Get all user
  fastify.get('/alltasks/:id', async (request, reply) => {
    const { id } = request.params as { id : string };
    const client = await pool.connect();
    try {
      const result = await client.query(`
        SELECT t.id, t.title, t.description, 
        u1.username AS creator_name, 
        u2.username AS shared_with_name, t.created_at 
        FROM tasks t 
        Left JOIN users u1 ON t.user_id = u1.firebaseuser 
        left JOIN users u2 ON t.shareid = u2.firebaseuser 
        WHERE t.user_id = $1 OR t.shareid = $1 ORDER BY t.created_at DESC;`, [id]);
      return reply.send(result.rows);
    } finally {
      client.release();
    }
  });

   // assign task
   fastify.put<{ Params: { id: string }, Body: UpdateTaskInput }>('/assign-task/:id', async (request, reply) => {
    const { id } = request.params;
    const { shareid, user_id } = request.body;
    const client = await pool.connect();
    try {
      const updateFields: string[] = [];
      const values: any[] = [];
      let paramCount = 1;

      if (shareid) {
        updateFields.push(`shareid = $${paramCount}`);
        values.push(shareid);
        paramCount++;
      }

      updateFields.push(`updated_at = now()`);
      values.push(id);

      const query = `
        UPDATE tasks 
        SET ${updateFields.join(', ')} 
        WHERE id = $${paramCount}
        RETURNING *
      `;

      const result = await client.query(query, values);
      if (result.rows.length === 0) {
        return reply.status(404).send({ message: 'Task not found' });
      }
      return reply.send(result.rows[0]);
    } finally {
      client.release();
    }
  });
  
  // Get task by ID
  fastify.get('/tasks/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT * FROM tasks WHERE id = $1', [id]);
      if (result.rows.length === 0) {
        return reply.status(404).send({ message: 'Task not found' });
      }
      return reply.send(result.rows[0]);
    } finally {
      client.release();
    }
  });

  // Create task
  fastify.post<{ Body: CreateTaskInput }>('/tasks', async (request, reply) => {
    const { title, description, status, user_id } = request.body;
    const client = await pool.connect();
    try {
      const result = await client.query(
        'INSERT INTO tasks (title, description, status, user_id) VALUES ($1, $2, $3, $4) RETURNING *',
        [title, description, status, user_id]
      );
      return reply.status(201).send(result.rows[0]);
    } finally {
      client.release();
    }
  });

  // Update task
  fastify.put<{ Params: { id: string }, Body: UpdateTaskInput }>('/tasks/:id', async (request, reply) => {
    const { id } = request.params;
    const { title, description } = request.body;
    const client = await pool.connect();
    try {
      const updateFields: string[] = [];
      const values: any[] = [];
      let paramCount = 1;

      if (title) {
        updateFields.push(`title = $${paramCount}`);
        values.push(title);
        paramCount++;
      }
      if (description !== undefined) {
        updateFields.push(`description = $${paramCount}`);
        values.push(description);
        paramCount++;
      }

      updateFields.push(`updated_at = now()`);
      values.push(id);

      const query = `
        UPDATE tasks 
        SET ${updateFields.join(', ')} 
        WHERE id = $${paramCount}
        RETURNING *
      `;

      const result = await client.query(query, values);
      if (result.rows.length === 0) {
        return reply.status(404).send({ message: 'Task not found' });
      }
      return reply.send(result.rows[0]);
    } finally {
      client.release();
    }
  });

  // Delete task
  fastify.delete('/tasks/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const client = await pool.connect();
    try {
      const result = await client.query('DELETE FROM tasks WHERE id = $1 RETURNING *', [id]);
      if (result.rows.length === 0) {
        return reply.status(404).send({ message: 'Task not found' });
      }
      return reply.send({ message: 'Task deleted successfully' });
    } finally {
      client.release();
    }
  });

}