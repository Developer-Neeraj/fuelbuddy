<template>
	<div class="limiter">
		<div class="container-login100">
			<div class="wrap-login100">
				<div class="login100-form-title">
					<span class="login100-form-title-1">
						Sign In
					</span>
				</div>

				<form class="login100-form validate-form" @submit.prevent="signInUser">
					<div class="wrap-input100 validate-input m-b-26" data-validate="Username is required">
						<span class="label-input100">User Email</span>
						<input v-model="email" class="input100" type="text" name="username" placeholder="Enter username">
						<span class="focus-input100"></span>
					</div>

					<div class="wrap-input100 validate-input m-b-18" data-validate = "Password is required">
						<span class="label-input100">Password</span>
						<input v-model="password" class="input100" type="password" name="pass" placeholder="Enter password">
						<span class="focus-input100"></span>
					</div>

					<p v-if="errorMessage">{{ errorMessage }}</p>


					<div class="container-login100-form-btn">
						<button class="login100-form-btn" type="submit">
							Login
						</button>
					</div>
                    <p style="cursor: pointer; margin: auto;padding: 10px;">Don't have an account? <a @click="$router.push('/signup')">Sign Up</a></p>
				</form>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref  } from 'vue';
import { useUserStore } from '../store/useUserStore';

const email = ref('');
const password = ref('');
const { signIn, errorMessage } = useUserStore();

const signInUser = async () => {
	await signIn(email.value, password.value);
};
</script>

<style scoped>

@import "../assets/css/main.css";
@import "../assets/css/util.css";

.login100-form-title {
    background-image: url('../assets/images/bg-01.jpg');
}
</style>