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
                                    <h4 class="mb-sm-0">Form Data PBB</h4>
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
                                                    <label class="form-label">NOP</label>
                                                    <Field type="text" oninput="this.value = this.value.replace(/[^0-9.]/g, '')" name="nop" class="form-control custom-rounded-medium" placeholder="Masukkan nop" v-model="form.nop" />
                                                    <ErrorMessage name="nop" :class="'text-danger'" />
                                                </div>
                                                <div class="col-md-6">
                                                    <label class="form-label">Tahun Pajak</label>
                                                    <Field type="number" name="tax_year" class="form-control custom-rounded-medium" placeholder="Masukkan tahun pajak" v-model="form.tax_year"/>
                                                    <ErrorMessage name="tax_year" :class="'text-danger'" />
                                                </div>
                                            </div>
                                            <div class="form-group row mb-3">
                                                <div class="col-md-6">
                                                    <label class="form-label">Nama Wajib Pajak</label>
                                                    <Field type="text" name="taxpayer_name" class="form-control custom-rounded-medium" placeholder="Masukkan nama wajib pajak" v-model="form.taxpayer_name"/>
                                                    <ErrorMessage name="taxpayer_name" :class="'text-danger'" />
                                                </div>
                                                <div class="col-md-6">
                                                    <div class="row">
                                                        <div class="col-md-6">
                                                            <label class="form-label">RW</label>
                                                            <Field type="text" name="rw" class="form-control custom-rounded-medium" placeholder="Masukkan RW" v-model="form.rw"/>
                                                        </div>
                                                        <div class="col-md-6">
                                                            <label class="form-label">RT</label>
                                                            <Field type="text" name="rt" class="form-control custom-rounded-medium" placeholder="Masukkan RT" v-model="form.rt"/>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="form-group row mb-3">
                                                <div class="col-md-6">
                                                    <label class="form-label">Kelurahan</label>
                                                    <Field type="text" name="village" class="form-control custom-rounded-medium" placeholder="Masukkan nama kelurahan" v-model="form.village"/>
                                                    <ErrorMessage name="village" :class="'text-danger'" />
                                                </div>
                                                <div class="col-md-6">
                                                    <label class="form-label">Kabupaten</label>
                                                    <Field type="text" name="district" class="form-control custom-rounded-medium" placeholder="Masukkan nama Kabupaten" v-model="form.district"/>
                                                    <ErrorMessage name="district" :class="'text-danger'" />
                                                </div>
                                            </div>
                                            <div class="form-group mb-3">
                                                <label class="form-label">Alamat</label>
                                                <Field as="textarea" name="address" rows="4" class="form-control custom-rounded-medium" placeholder="Masukkan kode" v-model="form.address"/>
                                            </div>
                                            <div class="form-group row mb-3">
                                                <div class="col-md-4">
                                                    <label class="form-label">Luas Bumi</label>
                                                    <Field type="number" name="land" class="form-control custom-rounded-medium" placeholder="Masukkan luas bumi" v-model="form.land"/>
                                                </div>
                                                <div class="col-md-4">
                                                    <label class="form-label">Luas Bangunan</label>
                                                    <Field type="number" name="building" class="form-control custom-rounded-medium" placeholder="Masukkan luas bangunan" v-model="form.building"/>
                                                </div>
                                                <div class="col-md-4">
                                                    <label class="form-label">Letak Objek</label>
                                                    <Field type="text" name="object" class="form-control custom-rounded-medium" placeholder="Masukkan letak objek" v-model="form.object"/>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="card-footer card-footer-custom-radius-medium">
                                            <div class="d-flex justify-content-end">
                                                <button type="button" @click="$router.back()" class="btn border-light bg-white custom-rounded-medium me-2" :disabled="fetch">Kembali</button>
                                                <button type="submit" class="btn btn-primary custom-rounded-medium" :disabled="fetch">Simpan</button>
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


import { Field, Form, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';

import { db } from '@/utils/firebase';
import { doc, setDoc, addDoc, getDoc, collection, getDocs, query, where } from "firebase/firestore";

export default {
    name: 'MasterKopak',
    data() {
        return {
            form: {
                location_id: this.$route.params.locationId,
                kopak_id: this.$route.params.kopakId,
                nop: '',
                tax_year: '',
                taxpayer_name: '',
                rw: '',
                rt: '',
                village: '',
                district: '',
                address: '',
                land: '',
                building: '',
                object: '',
            },
            fetch: false,
            loading: null
        }
    },
    components: {
         Field, Form, ErrorMessage
    },
    setup() {
        const schema = yup.object({
            nop: yup.number().typeError('NOP harus berupa angka').required('Masukkan NOP'),
            tax_year: yup.string().required('Masukkan Tahun Pajak'),
            taxpayer_name: yup.string().required('Masukkan Nama Wajib Pajak'),
            village: yup.string().required('Masukkan Kelurahan'),
            district: yup.string().required('Masukkan Kabupaten'),
        });

        return {
            schema
        }
    },
    async mounted() {
        if (this.$route.params.id) {
            const userDoc = await getDoc(doc(db, "pbb", this.$route.params.id));
            
            if (userDoc.exists()) {
                const data = userDoc.data();

                this.form = data
            }
        }
    },
    methods: {
        async handleSubmit() {
            try {
                if (await this.checkExistNOP() > 0) { // mengecek duplikasi NOP
                    this.$toast.error('NOP sudah digunakan');
                } else {
                    this.fetch = true
                    this.loading = this.$loading.show()
                    // Simpan data tambahan pengguna di Firestore
                    if (this.$route.params.id) {
                        await setDoc(doc(db, "pbb", this.$route.params.id), {
                            ...this.form,
                            createdAt: new Date(),
                        });
                    } else {
                        await addDoc(collection(db, "pbb"), {
                            ...this.form,
                            createdAt: new Date(),
                        });
                    }
                    
                    this.loading.hide()
                    this.$router.back()
                    this.$toast.success('Data Berhasil Disimpan');
                }
            } catch(error) {
                if (this.loading != null)
                    this.loading.hide()
                this.fetch = false

                let message = error.message || error.code
                this.$toast.error(message);
            }
        },
        async checkExistNOP() {
            this.fetch = true
            this.loading = this.$loading.show()
            const buildQuery = query(
                collection(db, "pbb"),
                where("kopak_id", "==", this.form.kopak_id),
            );
            const dataSnapshot = await getDocs(buildQuery);                
            const data = dataSnapshot.docs.
            map(doc => ({
                id: doc.id,
                ...doc.data()
            }))
            .filter(data => data.id != this.$route.params.id && data.nop == this.form.nop)

            this.fetch = false
            this.loading.hide()

            return data.length
        }
    }
}
</script>