<template>
    <div class="bg-overlay"></div>
    <div class="account-pages my-5 pt-5">
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-xl-4 col-lg-6 col-md-8">
                    <div class="card custom-rounded">
                        <div class="card-body p-4">
                            <div class="">
                                <div class="text-center mb-3">
                                    <a href="index.html" class="">
                                        <img src="@/assets/images/logo/logo.svg" alt="" height="60" class="auth-logo logo-dark mx-auto">
                                    </a>
                                </div>
                                <!-- end row -->
                                 <div class="d-flex justify-content-center mb-3">
                                     <img src="@/assets/images/logo.png" height="80">
                                 </div>
                                <h4 class="font-size-20 mt-2 text-center text-black">Login</h4>
                                <p class="mb-4 text-center text-muted font-size-12">Silahkan masukan email dan password.</p>
                                <Form :validation-schema="schema" @submit="handleSubmit" class="form-horizontal">
                                    <div class="row">
                                        <div class="col-md-12">
                                            <div class="mb-3">
                                                <label class="form-label" for="email">Email</label>
                                                <Field type="text" class="form-control" id="email" name="username" placeholder="Masukan email" v-model="username" />
                                                <ErrorMessage name="username" :class="'text-danger'" />
                                            </div>
                                            <div class="mb-3">
                                                <label class="form-label" for="userpassword">Password</label>
                                                <div style="position: relative;">
                                                    <Field :type="togglePasswordVisibility ? 'text' : 'password'" name="password" class="form-control" placeholder="Masukan password" v-model="password" />
                                                    <i class="mdi" v-if="password" :class="{'mdi-eye': togglePasswordVisibility, 'mdi-eye-off': !togglePasswordVisibility}" style="position: absolute; top: 10px; right: 10px; cursor: pointer" @click="togglePasswordVisibility = !togglePasswordVisibility"></i>
                                                </div>
                                                <ErrorMessage name="password" :class="'text-danger'" />
                                            </div>
                                            <!-- <div class="mt-3 mt-md-0">
                                                <a href="javascript:void(0)" class="text-muted"><i class="mdi mdi-lock"></i> Forgot your password?</a>
                                            </div> -->
                                            <div class="d-grid mt-4">
                                                <button class="btn btn-primary button-rounded waves-effect waves-light" type="submit">Login</button>
                                            </div>
                                            <!-- <div class="d-flex mt-3 font-size-12 justify-content-center">
                                                <span class="me-1">Tidak Memiliki Akun ?</span>
                                                <router-link to="/register" class="text-muted fw-bold">Daftar</router-link>
                                            </div> -->
                                        </div>
                                    </div>
                                </Form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- end row -->
        </div>
    </div>
</template>
<script>
import { auth } from '@/utils/firebase';
import { signInWithEmailAndPassword } from "firebase/auth";

import { Field, Form, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';

export default {
    name: 'Signin',
    data() {
        return {
            loader: null,
            username: '',
            password: '',
            fetch: false,
            loading: false,
            togglePasswordVisibility: false
        }
    },
    setup() {
        const schema = yup.object({
            username: yup.string().required('Masukan email'),
            password: yup.string().required('Masukan password'),
        });

        return {
            schema
        }
    },
    components: {Field, Form, ErrorMessage},
    methods: {
        async handleSubmit() {
            try {
                this.loading = this.$loading.show()
                const userCredential = await signInWithEmailAndPassword(auth, this.username, this.password);
                this.loading.hide()

                if (userCredential.user) {
                    localStorage.setItem('token', userCredential.user.accessToken)
                    this.$router.push("/");
                }
            } catch(error) {
                this.loading.hide()
                this.fetch = false
                let message = error.code

                if (message == 'auth/invalid-credential')
                    message = 'Email atau password salah'
                else if (message == 'auth/invalid-email')
                    message = 'Akun tidak ditemukan'

                this.$toast.error(message);
            }
        }
    }
}
</script>