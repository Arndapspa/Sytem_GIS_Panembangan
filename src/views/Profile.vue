<template>
    <main>
        <div id="layout-wrapper">
            <div class="main-content">
                <div class="page-content">
                    <div class="container-fluid">
                        <!-- title of page -->
                        <div class="row justify-content-center">
                            <div class="col-6 mt-3">
                                <div class="page-title-box d-sm-flex align-items-center justify-content-between">
                                    <h4 class="mb-sm-0">Profile</h4>
                                </div>
                            </div>
                        </div>
                        <div class="row justify-content-center">
                            <div class="col-md-6">
                                <Form :validation-schema="schema" @submit="handleSubmit">
                                    <div class="card custom-rounded-medium">
                                        <div class="card-body">
                                            <h6 class="mb-3">Silahkan lengkapi form dibawah ini dengan benar.</h6>
                                            <div class="spacer-medium"></div>
                                            <div class="form-group mb-3">
                                                <label class="form-label">Nama</label>
                                                <div name="name" class="form-control custom-rounded-medium bg-white" disabled>{{ $store.state.user?.name }}</div>
                                            </div>
                                            <div class="form-group mb-3">
                                                <label class="form-label">Email</label>
                                                <div name="name" class="form-control custom-rounded-medium bg-white" disabled>{{ $store.state.user?.email }}</div>
                                            </div>
                                            <div class="form-group mb-3" v-if="$store.state.user?.role != 'superadmin'">
                                                <label class="form-label">No. Telepon</label>
                                                <div name="name" class="form-control custom-rounded-medium bg-white" disabled>{{ $store.state.user?.phone || '-' }}</div>
                                            </div>
                                            <div class="form-group mb-3" v-if="['superadmin', 'admin'].indexOf($store.state.user?.role) < 0">
                                                <label class="form-label">Alamat</label>
                                                <div name="name" class="form-control custom-rounded-medium bg-white" style="height: 200px" disabled>{{ $store.state.user?.address || '-' }}</div>
                                            </div>
                                        </div>
                                        <div class="card-footer card-footer-custom-radius-medium">
                                            <div class="d-flex justify-content-end">
                                                <button @click="$router.push('/')" class="btn border-light bg-white custom-rounded-medium">Kembali</button>
                                            </div>
                                        </div>
                                    </div>
                                </Form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>
<script>
import simplebar from 'simplebar-vue';
import 'simplebar-core/dist/simplebar.css';

import { Field, Form, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';

import { db } from '@/utils/firebase';
import { doc, setDoc, addDoc, getDoc, getDocs, collection, query, orderBy } from "firebase/firestore";

import { useRoute } from 'vue-router';

import axios from 'axios';

export default {
    name: 'Profile',
    data() {
        return {
        }
    },
    components: {
        simplebar
    },
}
</script>