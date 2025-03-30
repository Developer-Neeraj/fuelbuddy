<template>
	<div class="limiter">
		<div class="container-login100">
			<div class="wrap-login100">
				<div class="login100-form-title">
					<span class="login100-form-title-1">
						Sign Up
					</span>
				</div>
				<form class="login100-form validate-form" @submit.prevent="registerUser">
					<div class="wrap-input100 validate-input m-b-26" data-validate="Username is required">
						<span class="label-input100">Username</span>
						<input class="input100" type="text" v-model="username" name="username" placeholder="Enter username">
						<span class="focus-input100"></span>
					</div>

                    <div class="wrap-input100 validate-input m-b-26" data-validate="Username is required">
						<span class="label-input100">Email</span>
						<input class="input100" type="email" v-model="email" name="username" placeholder="Enter username">
						<span class="focus-input100"></span>
					</div>

					<div class="wrap-input100 validate-input m-b-18" data-validate = "Password is required">
						<span class="label-input100">Password</span>
						<input class="input100" type="password" v-model="password" name="pass" placeholder="Enter password">
						<span class="focus-input100"></span>
					</div>

					<div class="container-login100-form-btn">
						<p v-if="errorMessage">{{ errorMessage }}</p>
						<button class="login100-form-btn" type="submit">
							Sign Up
						</button>
					</div>
                        <p style="margin: auto;padding: 10px;cursor: pointer;">Have an account? <a @click="$router.push('/login')">Sign IN</a></p>
				</form>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useUserStore } from '../store/useUserStore';

const email = ref('');
const password = ref('');
const username = ref('');
const {register, errorMessage} = useUserStore();

const registerUser = async () => {
  await register(email.value, password.value, username.value);
  console.log('errorMessage_neer', errorMessage)
  if (!errorMessage) {
    alert('Registration successful!');
  }
};
</script>

<style>
@import "../assets/css/main.css";
@import "../assets/css/util.css";
.login100-form-title {
    background-image: url('../assets/images/bg-01.jpg');
}
</style>