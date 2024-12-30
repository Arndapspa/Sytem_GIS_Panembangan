<template>
    <main>
        <div id="layout-wrapper">
            <div class="main-content">
                <div class="page-content">
                    <div class="container-fluid">
                        <!-- title of page -->
                        <div class="row">
                            <div class="col-12 mt-3">
                                <div class="page-title-box d-sm-flex align-items-center justify-content-between">
                                    <h4 class="mb-sm-0">Form Data Kopak</h4>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-12">
                                <Form :validation-schema="schema" @submit="handleSubmit">
                                    <div class="card custom-rounded-medium">
                                        <div class="card-body">
                                            <h6 class="mb-3">Silahkan lengkapi form dibawah ini dengan benar.</h6>
                                            <div class="spacer-medium"></div>
                                            <div class="form-group row mb-3">
                                                <div class="col-md-6">
                                                    <label class="form-label">Nama</label>
                                                    <Field type="text" name="name" class="form-control custom-rounded-medium" placeholder="Masukkan nama" v-model="form.name"/>
                                                    <ErrorMessage name="name" :class="'text-danger'" />
                                                </div>
                                                <div class="col-md-6">
                                                    <label class="form-label">No Kopak</label>
                                                    <Field type="number" name="number" class="form-control custom-rounded-medium" placeholder="Masukkan no kopak" v-model="form.number"/>
                                                </div>
                                            </div>
                                            <div class="form-group row mb-3">
                                                <div class="col-md-6">
                                                    <div class="row">
                                                        <div class="col-md-6">
                                                            <label class="form-label">RW</label>
                                                            <Field type="number" name="rw" class="form-control custom-rounded-medium" placeholder="Masukkan RW kopak" v-model="form.rw"/>
                                                        </div>
                                                        <div class="col-md-6">
                                                            <label class="form-label">RT</label>
                                                            <Field type="number" name="rt" class="form-control custom-rounded-medium" placeholder="Masukkan RT kopak" v-model="form.rt"/>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-md-6">
                                                    <label class="form-label">Luas Wilayah (m<sup>2</sup>)</label>
                                                    <Field type="text" name="buildingArea" class="form-control custom-rounded-medium" placeholder="Masukkan luas wilayah" v-model="form.buildingArea"/>
                                                </div>
                                            </div>
                                            <div class="row mb-3">
                                                <div class="col-md-6">
                                                    <div class="form-group">
                                                        <label class="form-label">Jumlah WP</label>
                                                        <Field type="text" name="totalWP" class="form-control custom-rounded-medium" placeholder="Masukkan jumlah WP" v-model="form.totalWP"/>
                                                    </div>
                                                </div>
                                                <div class="col-md-6">
                                                    <div class="form-group">
                                                        <label class="form-label">Penanggung Jawab Kopak</label>
                                                        <Field as="select" name="supervisorId" class="form-select custom-rounded-medium" v-model="form.supervisorId">
                                                            <option value="">Pilih Penanggung Jawab</option>
                                                            <option v-for="item in listAdmin" :value="item.id">{{ item.name }}</option>
                                                        </Field>
                                                        <ErrorMessage name="supervisorId" :class="'text-danger'" />
                                                    </div>
                                                    <!-- <div class="d-block">
                                                        <div class="form-group">
                                                            <label class="form-label">Daftar Petugas</label>
                                                            <div class="d-block bg-light custom-rounded p-3 mb-2" v-for="staff, index in form.staff" :key="index">
                                                                <label class="form-label">Petugas #{{ index + 1 }}</label>
                                                                <select class="form-select custom-rounded-medium" v-model="form.staff[index]" @click="validateStaff(index)">
                                                                    <option value="">Pilih Petugas</option>
                                                                    <option v-for="item in listStaff" :value="item.id" :disabled="!item.show" :class="{'bg-light text-muted': !item.show}">{{ item.name }}</option>
                                                                </select>
                                                            </div>
                                                            <div class="spacer-medium"></div>
                                                            <div class="d-flex justify-content-end">
                                                                <button type="button" class="btn btn-outline-primary custom-rounded-medium" @click="addStaff"><i class="mdi mdi-plus me-1"></i>Tambah Petugas</button>
                                                            </div>
                                                        </div>
                                                    </div> -->
                                                </div>
                                            </div>
                                            <div class="d-none form-group row">
                                                <div class="col-md-6">
                                                    <label class="form-label">Latitude</label>
                                                    <Field type="number" name="latitude" class="form-control custom-rounded-medium" placeholder="Masukkan latitude" v-model="form.latitude"/>
                                                </div>
                                                <div class="col-md-6">
                                                    <label class="form-label">Longitude</label>
                                                    <Field type="number" name="longitude" class="form-control custom-rounded-medium" placeholder="Masukkan longitude" v-model="form.longitude"/>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="card-footer card-footer-custom-radius-medium">
                                            <div class="d-flex justify-content-end">
                                                <button type="button" @click="$router.back()" class="btn border-light bg-white custom-rounded-medium me-2">Kembali</button>
                                                <button type="submit" class="btn btn-primary custom-rounded-medium">Simpan</button>
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
import { doc, setDoc, addDoc, getDoc, getDocs, collection, query, orderBy, where } from "firebase/firestore";

import { useRoute } from 'vue-router';

import axios from 'axios';

export default {
    name: 'MasterKopak',
    data() {
        return {
            id: this.$route.params.id || '',
            form: {
                name: '',
                number: '',
                block: '',
                totalWP: '',
                supervisorId: '',
                buildingArea: '',
                supervisorId: '',
                latitude: '',
                longitude: '',
                rw: '',
                rt: '',
                staff: ['']
            },
            listAdmin: [],
            listStaff: [],
            loading: null,
            prevNumber: '',
        }
    },
    components: {
        simplebar, Field, Form, ErrorMessage
    },
    setup() {
        const route = useRoute();
        
        const schema = yup.object({
            name: yup.string().required('Masukkan nama'),
            supervisorId: yup.string().required('Masukkan penanggung jawab'),
        });

        const api = axios.create({
            timeout: 30000,
        });

        return {
            schema,
            api
        }
    },
    async mounted() {
        if (this.id) {
            const dataDoc = await getDoc(doc(db, "kopak", this.id));
            
            if (dataDoc.exists()) {
                const data = dataDoc.data();

                this.prevNumber = data.number

                this.form = {
                    ...data
                }
            }
        }
        this.fetchDataAdmin()
    },
    methods: {
        async handleSubmit() {
            const checkExistsCode = await this.checkDuplicateByCode()
            const checkExistsName = await this.checkDuplicateByName()

            if (checkExistsCode > 0) {
                this.$toast.error('No Kopak Sudah digunakan');
            } else if (checkExistsName > 0) {
                this.$toast.error('Nama Kopak Sudah digunakan');
            } else {
                this.saveData(this.id)
            }
        },
        async saveData(id) {
            try {
                // if (this.form.staff.filter((data) => data).length > 0) {
                    this.loading = this.$loading.show()
                    // Simpan data tambahan pengguna di Firestore
                    if (id) {
                        await setDoc(doc(db, "kopak", id), {
                            ...this.form,
                        });
                    } else {
                        await addDoc(collection(db, "kopak"), {
                            ...this.form,
                            createdAt: new Date(),
                        });
                    }
                    
                    this.loading.hide()
                    this.$router.back()
                    this.$toast.success('Data Kopak Berhasil Disimpan');
                // } else {
                //     this.$toast.error('Silahkan pilih petugas terlebih dahulu!');
                // }
            } catch(error) {
                if (this.loading != null)
                    this.loading.hide()
                this.fetch = false

                let message = error.message || error.code
                this.$toast.error(message);
            }
        },
        async fetchDataAdmin() {
            try {
                this.loading = this.$loading.show()
                const usersQuery = query(
                    collection(db, "users"),
                    orderBy("name", 'asc'),
                    // startAt(this.keywords),
                    // endAt(this.keywords + "\uf8ff") 
                );
                const querySnapshot = await getDocs(usersQuery);                
                const listUsers = querySnapshot.docs
                .map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    show: true
                }))

                // get kopak supervisor
                const kopakQuery = query(
                    collection(db, "kopak"),
                );
                const kopakSnapshot = await getDocs(kopakQuery);                
                const superVisorExists = kopakSnapshot.docs
                .map(doc => doc.data().supervisorId)

                this.listAdmin = listUsers.filter((data) => data.role == 'admin' && data.show === true && !superVisorExists.includes(data.id))
                this.listStaff = listUsers.filter((data) => data.role == 'staff' && data.show === true && !superVisorExists.includes(data.id))

                this.loading.hide()
            } catch (e) {
                this.error = "Error fetching documents: " + e.message;
            } finally {
            }
        },
        addStaff() {
            if (this.form.staff.filter((data) => data != '').length > 0) {
                if (this.listStaff.filter((data) => data.show).length > 0 && this.form.staff.length < this.listStaff.length) {
                    this.form.staff.push('')
                    this.validateStaff(this.form.staff.length)
                } else {
                    this.$toast.error('Jumlah form melebihi jumlah petugas yang dapat dipilih!');
                }
            } else {
                this.$toast.error('Silahkan pilih petugas terlebih dahulu!');
            }
        },
        removeStaff(index) {
            this.form.staff.splice(index, 1)
        },
        validateStaff(index) {
            this.listStaff.forEach(element => {
                if (this.form.staff.indexOf(element.id) != -1) {
                    if (this.form.staff[index] == element.id)
                        element.show = true
                    else
                        element.show = false
                } else
                    element.show = true
            });
        },
        async checkDuplicateByCode() {
            this.loading = this.$loading.show()
            const dataQuery = query(
                collection(db, "kopak"),
                where("number", '==', this.form.number.toString()),
            );
            const querySnapshot = await getDocs(dataQuery);    
            const data = querySnapshot.docs
            .map(doc => ({
                id: doc.id
            }))
            .filter(data => data.id != this.id);

            this.loading.hide()
            return data.length
        },
        async checkDuplicateByName() {
            this.loading = this.$loading.show()
            const dataQuery = query(
                collection(db, "kopak"),
                where("name", '==', this.form.name.toString()),
            );
            const querySnapshot = await getDocs(dataQuery);    
            const data = querySnapshot.docs
            .map(doc => ({
                id: doc.id
            }))
            .filter(data => data.id != this.id);

            this.loading.hide()
            return data.length
        }
    }
}
</script>