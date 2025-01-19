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
                                    <div class="d-flex align-items-center">
                                        <router-link to="/" class="btn button-circle bg-white border me-3 d-flex align-items-center justify-content-center"><i class="mdi mdi-arrow-left fs-4"></i></router-link>
                                        <h4 class="mb-sm-0">Informasi Kopak</h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-3">
                                <div class="card custom-rounded-medium">
                                    <div class="card-header bg-primary card-header-custom-radius-medium">
                                        <h5 class="text-center text-white my-2 fw-bold">{{ detailKopak.name }}</h5>
                                    </div>
                                    <div class="card-body">
                                        <div class="d-flex justify-content-between">
                                            <p class="text-dark">No Kopak</p>
                                            <h6 class="fw-bold text-primary">{{ detailKopak.number }}</h6>
                                        </div>
                                        <div class="d-flex justify-content-between">
                                            <p class="text-dark">RW/RT</p>
                                            <h6 class="fw-bold text-primary">{{ detailKopak.rw || '-' }} / {{ detailKopak.rt || '-' }}</h6>
                                        </div>
                                        <div class="d-flex justify-content-between">
                                            <p class="text-dark">Jumlah WP</p>
                                            <h6 class="fw-bold text-primary text-end">{{ findLocationByKopak }}</h6>
                                        </div>
                                        <div class="d-flex justify-content-between">
                                            <p class="text-dark">Luas Wilayah</p>
                                            <h6 class="fw-bold text-primary text-end">{{ detailKopak.buildingArea }} m<sup>2</sup></h6>
                                        </div>
                                        <div class="d-flex justify-content-between">
                                            <p class="text-dark flex-shrink-0">PJ Kopak</p>
                                            <h6 class="fw-bold text-primary text-end">{{ detailSupervisor.name }}</h6>
                                        </div>
                                        <div class="d-flex justify-content-between">
                                            <p class="text-dark">No. Telp</p>
                                            <h6 class="fw-bold text-primary text-end">{{ detailSupervisor.phone }}</h6>
                                        </div>
                                    </div>
                                    <!-- end card-body -->
                                     <div class="card-footer bg-white card-footer-custom-radius-medium" v-if="$store.state.user?.role == 'superadmin'">
                                        <div class="d-grid">
                                            <router-link :to="`/master-kopak/form/${id}`" class="btn btn-outline-primary custom-rounded-medium">Ubah Kopak</router-link>
                                        </div>
                                     </div>
                                </div>
                                <!-- end card -->
                                    <div class="card custom-rounded-medium">
                                        <div class="card-body">
                                            <h6 class="mb-3">Daftar Kopak Lainnya</h6>
                                            <div class="grid">
                                                <template v-for="item in listKopak">
                                                    <div class="btn btn-outline-primary custom-rounded" @click="openKopak(item.id)" v-if="item.id != id">{{ item.name }}</div>
                                                </template>
                                            </div>
                                        </div>
                                    </div>
                            </div>
                            <div class="col-md-9">
                                <div class="card custom-rounded-medium">
                                    <div class="card-header bg-primary card-header-custom-radius-medium">
                                        <h5 class="text-center text-white my-2 fw-bold">Maps Kopak</h5>
                                    </div>
                                    <div class="card-body">
                                        <div style="position: relative">
                                            <div class="header-map mb-3">
                                                <Autocomplete class="w-100" :source="dataAutoComplete" v-model="ownerName" :placeholder="'Cari kepemilikian PBB disini sesuai nama pemilik'" @onSelectedAutocomplete="onSelectedAutocomplete" />
                                            </div>
                                            <div class="custom-rounded-medium mb-3" style="height: 600px; width: 100%; z-index: 1;" id="map" :class="{'d-flex align-items-center justify-content-center bg-light': !this.detailKopak.latitude || !this.detailKopak.longitude}"></div>
                                        </div>
                                        <div class="d-block bg-light p-3 custom-rounded-medium" v-if="showDetail">
                                            <div class="d-flex justify-content-between mb-4">
                                                <div class="d-block">
                                                    <h5 class="mt-2 mb-1">Detail Kepemilikan</h5>
                                                    <div>{{ detailMap.kopak?.name }} <span v-if="!detailMap.data?.nop">- {{ detailMap.title }}</span></div>
                                                </div>
                                                <a href="javascript:void(0)" @click="closeDetailPBB()"><i class="mdi mdi-close font-size-20 text-muted"></i></a>
                                            </div>
                                            <div class="row" v-if="detailMap.data?.nop">
                                                <div class="col-md-6">
                                                    <div class="form-group mb-3">
                                                        <div>NOP</div>
                                                        <div class="h6">{{ detailMap.data.nop }}</div>
                                                    </div>
                                                    <div class="form-group mb-3">
                                                        <div>Nama Wajib Pajak</div>
                                                        <div class="h6">{{ detailMap.data.taxpayer_name }}</div>
                                                    </div>
                                                    <div class="form-group mb-3">
                                                        <div>RT/RW</div>
                                                        <div class="h6">{{ detailMap.data.rt }} / {{ detailMap.data.rw }}</div>
                                                    </div>
                                                    <div class="form-group mb-3">
                                                        <div>Kabupaten</div>
                                                        <div class="h6">{{ detailMap.data.village }}</div>
                                                    </div>
                                                    <div class="form-group mb-3">
                                                        <div>Luas Bangunan</div>
                                                        <div class="h6">{{ detailMap.data.building }} m</div>
                                                    </div>
                                                </div>
                                                <div class="col-md-6">
                                                    <div class="form-group mb-3">
                                                        <div>Tahun Pajak</div>
                                                        <div class="h6">{{ detailMap.data.tax_year }}</div>
                                                    </div>
                                                    <div class="form-group mb-3">
                                                        <div>Alamat</div>
                                                        <div class="h6">{{ detailMap.data.address }}</div>
                                                    </div>
                                                    <div class="form-group mb-3">
                                                        <div>Kelurahan</div>
                                                        <div class="h6">{{ detailMap.data.village }}</div>
                                                    </div>
                                                    <div class="form-group mb-3">
                                                        <div>Luas Bumi</div>
                                                        <div class="h6">{{ detailMap.data.land }} m</div>
                                                    </div>
                                                    <div class="form-group mb-3">
                                                        <div>Letak Objek</div>
                                                        <div class="h6">{{ detailMap.data.object }}</div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="d-block bg-white custom-rounded-medium text-center p-4" style="border: 1px dashed #909090 !important;" v-else>
                                                <img src="@/assets/images/empty-inbox.png" style="width: 150px;" class="img-fluid mb-3">
                                                <div class="mb-3">Data PBB belum ada pada titik koordinat ini</div>
                                                <router-link :to="`/master-kopak/form/detail/${detailMap.kopak_id}/${detailMap.id}`" class="btn btn-primary custom-rounded-medium mb-3">
                                                    <div class="d-flex align-items-center justify-content-center p-2">
                                                        <i class="mdi mdi-plus fs-5 me-1 m-0 pb-0"></i>
                                                        <div>
                                                            Tambah Data PBB Baru
                                                        </div>
                                                    </div>
                                                </router-link>
                                                <div>
                                                    <button type="button" class="btn btn-link text-dark fw-bold text-decoration-none" @click="confirmDeleteLocation" v-if="detailKopak.supervisorId == $store.state.user?.id || $store.state.user?.role == 'superadmin'"><i class="mdi mdi-trash-can-outline me-2"></i>Hapus Lokasi</button>
                                                </div>
                                            </div>
                                        </div>
                                        <template v-else>
                                            <div v-if="this.detailKopak.latitude && this.detailKopak.longitude">
                                                <div v-if="allPolygons.length" class="d-flex align-items-center justify-content-center px-3 py-4 bg-light custom-rounded-medium"><i class="mdi mdi-information me-2"></i>Silahkan klik lokasi pada map untuk melihat data PBB</div>
                                                <div v-else class="d-flex align-items-center justify-content-center px-3 py-4 bg-light custom-rounded-medium"><i class="mdi mdi-information me-2"></i>Silahkan membuat denah dengan cara klik lokasi pada map</div>
                                            </div>
                                        </template>
                                    </div>
                                    <div class="card-footer text-end" v-if="showDetail && detailMap.data?.nop">
                                        <button type="button" class="btn btn-link text-dark fw-bold me-2 text-decoration-none" @click="deleteDataPBB" v-if="detailMap.kopak?.supervisorId == $store.state.user?.id || $store.state.user?.role == 'superadmin'"><i class="mdi mdi-trash-can-outline me-2"></i>Hapus PBB</button>
                                        <router-link :to="`/master-kopak/form/detail/${id}/${detailMap.id}/${detailMap.data.primary_id}`" class="btn btn-primary custom-rounded-medium" v-if="$store.state.user?.role != 'staff'">Edit Data PBB</router-link>
                                    </div>
                                    <!-- end card-body -->
                                </div>
                                <!-- end card -->
                            </div>
                            <!-- end col -->
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>
<style scoped>

.grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
    gap: 15px;
}
</style>
<script>
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import "leaflet-fullscreen/dist/leaflet.fullscreen.css";

import L from "leaflet";
import 'leaflet-draw';
import "leaflet-fullscreen";

import { find, findIndex, uniqBy, includes, map, chunk } from 'lodash';

import { v4 as uuidv4 } from 'uuid';

import { db } from '@/utils/firebase';
import { doc, addDoc, updateDoc, getDocs, getDoc, collection, query, where, deleteDoc, orderBy } from "firebase/firestore";

import Autocomplete from '@/components/Autocomplete.vue';

export default {
    name: 'KopakInformation',
    data() {
        return {
            id: this.$route.params.id,
            detailKopak: {},
            detailMap: {
                data: {}
            },
            detailSupervisor: {},
            showDetail: false,
            initialMap: null,
            allPolygons: [],
            points: [],
            polygons: [], // Menyimpan semua polygon yang digambar
            polyline: null, // Referensi ke garis yang sedang digambar
            loading: null,
            fetch: null,
            polygonClicked: null,
            allPBB: [],
            dataAutoComplete: [],
            ownerName: '',
            ownerSelected: {
                id: '',
                name: ''
            },
            drawnItems: null,
            listKopak: []
        }
    },
    watch: {
        ownerName(value) { //nyari nama pemilik
            if (value != this.ownerSelected.name) {
                this.polygons.forEach(element => {
                    const checkDetailPolygon = find(this.allPolygons, {id: element.options.id})

                    if (checkDetailPolygon.is_owner) {
                        element.setStyle({
                            color: "blue", // Warna garis tepi
                            fillColor: "rgba(0, 0, 255, 1)", // Warna isian (dengan transparansi)
                        });
                    } else {
                        element.setStyle({
                            color: "#202020", // Warna garis tepi
                            fillColor: "rgba(0, 0, 0, 1)", // Warna isian (dengan transparansi)
                        });
                    }
                });
            }
        },
        '$route.params.id'(newId) { // id di ambil dari nama variable pada router (/router/index.js : line 88)
            this.id = newId;

            this.$router.replace({ path: '/' })
            setTimeout(() => {
                this.$router.replace('/kopak/detail/' + newId);
            }, 100);
        },
    },
    components: {
        Autocomplete
    },
    computed: {
        findLocationByKopak() { // proses pencarian denah berdasarkan id kopak yang sedang dibuka dan dihitung 
            return this.allPolygons.filter(data => data.kopak_id == this.id)?.length
        }
    },
    async mounted() { // ketika html kosongan ditampilkan, maka ada proses pengambilan data ke firestore
        if (this.id) {
            this.detailKopak = await this.fetchDetailKopak(this.id);
            this.detailKopak.latitude = -7.3831153 //lokasi desa panembangan
            this.detailKopak.longitude = 109.1252189
            
            if (this.detailKopak) {
                await this.fetchDataKopak()
                await this.getSuppervisor()
                await this.fetchDataLocation()
                await this.fetchDataPBB()
                if (this.detailKopak.latitude && this.detailKopak.longitude)
                    await this.initMap()
            }
        }
    },
    methods: {
        async fetchDetailKopak(id) { // mengambil data kopak berdasarkan id (dari paramater router) ke firestore
            const dataDoc = await getDoc(doc(db, "kopak", id));
            
            if (dataDoc.exists()) {
                const data = dataDoc.data();

                return data
            } else {
                return {}
            }
        },
        async fetchDataLocation() { // mengambil data denah dari firestore
            try {
                this.loading = this.$loading.show()
                const usersQuery = query(
                    collection(db, "location"),
                );
                const querySnapshot = await getDocs(usersQuery);                
                const dataList = querySnapshot.docs
                .map(doc => ({ // manipulasi data denah dari firestore (mengambil data yang digunakan saja dan menambahkan attribute is_owner yang tidak ada di firestore)
                    primary_id: doc.id,
                    id: doc.data().id,
                    kopak_id: doc.data().kopak_id,
                    is_owner: doc.data().kopak_id == this.id,
                    points: JSON.parse(doc.data().points),
                    title: doc.data().title,
                }))
                
                // memasukan data ke variable yang ada di section data()
                this.allPolygons = dataList
            } catch (e) {
                console.log("Error fetching documents: " + e.message);
            } finally {
                this.loading.hide()
            }
        },
        async fetchDataPBB() { // mengambil data kepemilikan pbb
            try {
                this.loading = this.$loading.show()
                
                const ids = map(this.allPolygons, 'id'); // Mengambil ID dari allPolygons
                const batchSize = 30; // Maksimum jumlah ID per query dari firestore
                const chunks = chunk(ids, batchSize); // Membagi pengambilan data pbb menjadi per 30 data
                
                let results = [];

                for (const batch of chunks) {
                    const usersQuery = query(
                        collection(db, "pbb"),
                        where('location_id', 'in', batch)
                    );

                    const querySnapshot = await getDocs(usersQuery);

                    const batchResults = querySnapshot.docs.map(doc => ({
                    primary_id: doc.id,
                    ...doc.data(),
                    }));

                    results = [...results, ...batchResults]; // Gabungkan hasil dari semua batch
                }

                this.allPBB = results
                // uniqBy : untuk melakukan filter data pbb menjadi unik berdasarkan nama
                this.dataAutoComplete = uniqBy(results.map(data => {
                    return {
                        id: data.primary_id,
                        name: data.taxpayer_name
                    }
                }), 'name')
            } catch (e) {
                console.log("Error fetching documents: " + e.message);
            } finally {
                this.loading.hide()
            }
        },
        async detailPBB(locationId) {
            try {
                // pencarian data pbb pada variable allPBB (semua data pbb) berdasarkan id denah
                // findIndex: pencarian index array berdasarkan attribute location_id
                const indexPBB = findIndex(this.allPBB, {location_id: locationId})
                
                if (indexPBB > -1) { // jika ditemukan data pbb nya
                    this.detailMap.data = this.allPBB[indexPBB]
                } else {
                    this.detailMap.data = []
                }
            } catch (e) {
                console.log("Error fetching documents: " + e.message);
            }
        },
        async initMap() {
            // inisialisasi map OSM
            this.initialMap = L.map("map", {
                zoomControl: false,
                zoomAnimation: true,
                fadeAnimation: true,
                markerZoomAnimation: false,
                crs: L.CRS.EPSG3857, // CRS default
            }).setView([this.detailKopak.latitude, this.detailKopak.longitude], 15);

            // Google Maps Satellite Tile Layer
            const googleSatellite = L.tileLayer('https://mt{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
                subdomains: ['0', '1', '2', '3'], // Subdomain Google
                maxZoom: 21, // Set max zoom yang lebih tinggi
                attribution: '&copy; <a href="https://www.google.com/maps">Google Maps</a>',
            });

            // Tambahkan layer ke Peta
            googleSatellite.addTo(this.initialMap);

            // ==================================== FITUR DRAW MAP ===========================================
            // Inisialisasi FeatureGroup untuk menyimpan gambar
            this.drawnItems = new L.FeatureGroup();
            this.initialMap.addLayer(this.drawnItems);

            // Inisialisasi kontrol gambar
            const drawControl = new L.Control.Draw({
                edit: {
                    featureGroup: this.drawnItems, // Group untuk fitur yang bisa diedit
                },
                draw: {
                    polyline: {
                        shapeOptions: {
                            color: 'blue',
                            weight: 3
                        },
                        tooltip: false  // Menonaktifkan tooltip untuk polyline
                    },
                    polygon: false,
                    rectangle: false,
                    circle: false,
                    marker: false,
                    circlemarker: false,
                },
            });

            // jika role user yang login bukan petugas, maka tambahkan tools ke map
            if (this.$store.state.user?.role != 'staff') {
                this.initialMap.addControl(drawControl);
                drawControl.setPosition('bottomleft'); // Mengatur posisi kontrol
            }

            // Event ketika fitur telah digambar pada map
            this.initialMap.on(L.Draw.Event.CREATED, async (event) => {
                const polygonId = uuidv4()
                const layer = event.layer;
                this.drawnItems.addLayer(layer);

                if (event.layer instanceof L.Polyline) {
                    const latlngs = event.layer.getLatLngs();
                    latlngs.push(latlngs[0]); // Menghubungkan titik akhir ke titik awal

                    // Menghapus garis yang digambar
                    this.drawnItems.removeLayer(layer);

                    // Membuat polygon
                    const polygon = L.polygon(latlngs, {
                        id: polygonId,
                        color: "blue", // Warna garis tepi
                        fillColor: "rgba(0, 0, 255, 1)", // Warna isian (dengan transparansi)
                        fillOpacity: 0.5, // Tingkat transparansi isian
                        weight: 2
                    });
                    
                    this.polygons.push(polygon);

                    polygon.on("click", async(e) => {
                        let dataEvent = e.target
                        dataEvent.options.is_owner = true // menandai denah yang yang aktif
                        this.polygonClicked = dataEvent // menampung denah terakhir di klik
                        this.showDetail = true // menampilkan bag. html detail kepemilikan pbb
                        
                        this.detailMap = {
                            id: polygonId,
                            points: JSON.stringify(latlngs),
                            title: `Denah ${this.polygons.length + 1}`,
                            kopak_id: this.id,
                            kopak: this.detailKopak
                        }
                        this.setSelectedPolygon() // mengubah warna denah menjadi merah
                        this.detailPBB(polygonId) // proses pencarian pbb berasarkan id denah
                    });

                    // Menambahkan polygon ke drawnItems
                    this.drawnItems.addLayer(polygon);

                    // save to database
                    const dataPolygon = {
                        id: polygonId,
                        points: JSON.stringify(latlngs),
                        title: `Denah ${this.polygons.length + 1}`,
                        kopak_id: this.id
                    }
                    
                    await this.saveLocationToDatabase(dataPolygon)
                }
            });

            // Event ketika fitur diedit
            this.initialMap.on('draw:edited', (event) => {
                const layers = event.layers; // Semua layer yang diupdate
                layers.eachLayer(async (layer) => {
                    const dataPolygon = {
                        points: JSON.stringify(this.getLatLngArray(layer)), // pengambilan semua titik lat long pada gambar 
                    }

                    const detailLocation = find(this.allPolygons, { id: layer.options.id })
                    // proses simpan ke database
                    await this.saveLocationToDatabase(dataPolygon, detailLocation.primary_id)
                });
            });
            
            // Event ketika fitur dihapus
            this.initialMap.on('draw:deleted', async (event) => {
                const layers = event.layers; // Semua layer yang diupdate
                // Iterasi // looping secara berurutan menggunakan for...of
                for (const layer of layers.getLayers()) {
                    const detailPolygon = find(this.allPolygons, { id: layer.options.id });

                    if (detailPolygon) {
                        try {
                            // Tunggu hingga deleteLocation selesai sebelum melanjutkan ke layer berikutnya
                            await this.deleteLocation(detailPolygon.primary_id);
                            console.log(`Lokasi dengan ID ${detailPolygon.primary_id} berhasil dihapus.`);
                        } catch (error) {
                            console.error(`Gagal menghapus lokasi dengan ID ${detailPolygon.primary_id}`, error);
                        }
                    }
                }
            });

            // Tambahkan kontrol fullscreen
            this.initialMap.addControl(new L.Control.Fullscreen({position: 'bottomright' }));

            // ===================================================================================================================
            // pengambilan data denah dari database dan di masukan ke map (maps abu)
            if (this.allPolygons) {
                this.allPolygons.forEach(element => {
                    const polygon = L.polygon(element.points, {
                        id: element.id,
                        color: element.is_owner ? "blue" : "#202020", // Warna garis tepi
                        fillColor: element.is_owner ? "rgba(0, 0, 255, 1)" : "rgba(0, 0, 0, 1)", // Warna isian (dengan transparansi)
                        fillOpacity: 0.5, // Tingkat transparansi isian
                        weight: 2
                    }).addTo(this.initialMap)

                    this.polygons.push(polygon);

                    polygon.on("click", async(e) => {
                        let dataEvent = e.target
                        dataEvent.options.is_owner = element.is_owner
                        this.polygonClicked = dataEvent
                        this.showDetail = true
                        const dataKopak = await this.fetchDetailKopak(element.kopak_id)
                        
                        this.detailMap = {
                            ...element,
                            kopak: dataKopak
                        }
                        this.setSelectedPolygon()
                        this.detailPBB(element.id)
                    });
                });
            }
        },
        getLatLngArray(layer) {
            // mapping data array [[1322,21232], [1322,21232]] menjadi [{lat:1322, lng: 21232}]
            const latLngs = layer.getLatLngs()[0]; // Koordinat luar (lapisan pertama)
            return latLngs.map((latLng) => ({
                lat: latLng.lat,
                lng: latLng.lng,
            }));
        },
        setSelectedPolygon() {
            this.resetSelectedPolygon()
            // Ubah warna polygon
            this.polygonClicked.setStyle({
                color: "red", // Ubah warna garis menjadi merah
                fillColor: "rgba(255, 0, 0, 1)", // Ubah warna isi menjadi merah dengan transparansi
            });

            // Simpan polygon yang baru diklik sebagai referensi terakhir
            this.lastClickedPolygon = this.polygonClicked;
        },
        resetSelectedPolygon() {
            // Reset warna polygon sebelumnya jika ada
            if (this.lastClickedPolygon) {
                const locationByOwner = this.getLocationFromOwner() // mencari denah yang sedang dicari (denah berwarna jingga)
                if (this.ownerName && includes(locationByOwner, this.lastClickedPolygon.options.id)) {
                    // reset denah yang tidak diklik menjadi warna jingga, jika sedang mencari pemilik pbb
                    this.setSelectedPolygonByOwner()
                } else {
                    // warna denah direset menjadi warna biru / hitam berdasarkan kopak yang aktif/sedang di buka
                    this.lastClickedPolygon.setStyle({
                        color: this.lastClickedPolygon.options.is_owner ? "blue" : "#202020", // Warna garis tepi
                        fillColor: this.lastClickedPolygon.options.is_owner ? "rgba(0, 0, 255, 1)" : "rgba(0, 0, 0, 1)", // Warna isian (dengan transparansi)
                    });
                }
            }
        },
        async getSuppervisor() {
            // mengambil data users yang role nya admin berdasarkan id penanggung jawab
            const dataDoc = await getDoc(doc(db, "users", this.detailKopak.supervisorId));
            
            if (dataDoc.exists()) {
                const data = dataDoc.data();

                // menampunng data ke variable
                this.detailSupervisor = {
                    ...data
                }
            }
        },
        async saveLocationToDatabase(data, id=null) {
            // menyimpan data denah ke firestore database
            try {
                this.fetch = true
                this.loading = this.$loading.show() // memunculkan loading

                if (id) {
                    // jika melakukan operasi edit data denah
                    await updateDoc(doc(db, "location", id), data);
                } else {
                    // jika melakukan operasi tambah data denah
                    await addDoc(collection(db, "location"), {...data});
                }

                this.loading.hide()
                this.$toast.success('Data Berhasil Disimpan');

                // setelah proses operasi berhasil, maka melakukan pengambilan data denah kembali ke firebase
                await this.fetchDataLocation()
            } catch(error) {
                // penangangan error
                if (this.loading != null)
                    this.loading.hide()
                this.fetch = false

                let message = error.message || error.code
                this.$toast.error(message);

                console.log(message);
            }
        },
        async confirmDeleteLocation() {
            // popup menghapus data denah/lokasi
            this.$swal
                .fire({
                    title: 'Apakah kamu yakin ?',
                    html: `Kamu akan menghapus data lokasi dengan nama <b>${this.detailMap.title}</b>`,
                    icon: 'warning',
                    showDenyButton: true,
                    showCancelButton: false,
                    confirmButtonText: 'Ya',
                    confirmButtonColor: '#159895',
                    denyButtonColor: '#c0c0c0',
                    denyButtonText: 'Tidak',
                })
                .then(async (result) => {
                    if (result.isConfirmed) {
                        // menghapus daata lokasi/denah ke database
                        this.deleteLocation(this.detailMap?.primary_id)
                    }
                });
        },
        async deleteLocation(id) {
            try {
                this.loading = this.$loading.show()
                this.fetch = true
                if (id) {
                    // menghapus daata lokasi/denah ke database
                    await deleteDoc(doc(db, "location", id));
                }

                // menghapus gambar denah pada map yang terakhir diklik/yang sedang aktif (warna merah) / berhasil di hapus dari database
                if (this.polygonClicked) {
                    const searchIndex = findIndex(this.polygons, (data) => data.options.id == this.polygonClicked.options.id);
                    
                    if (searchIndex >= 0) {
                        if (this.polygons.length) {
                            // Iterasi semua polygon dan hapus dari peta
                            this.initialMap.removeLayer(this.polygons[searchIndex]);

                            // menghapus value pada array tertentu sesuai index (posisi)
                            // contoh data = [1,2,3] jika data.splice(2, 1), maka data pada posisi ke 2 akan dihapus
                            // output nya : [1,2]
                            this.polygons.splice(searchIndex, 1);
                        }
                    }
                }

                this.fetch = false
                this.loading.hide()
                this.showDetail = false
                this.$toast.success('Data berhasil dihapus');
            } catch(error) {
                this.fetch = false
                this.$toast.error(error);
                console.log(error);
            }
        },
        async deleteDataPBB() {
            this.$swal
                .fire({
                    title: 'Apakah kamu yakin ?',
                    html: `Kamu akan menghapus data dengan NOP <b>${this.detailMap.data.nop}</b>`,
                    icon: 'warning',
                    showDenyButton: true,
                    showCancelButton: false,
                    confirmButtonText: 'Ya',
                    confirmButtonColor: '#159895',
                    denyButtonColor: '#c0c0c0',
                    denyButtonText: 'Tidak',
                })
                .then(async (result) => {
                    if (result.isConfirmed) {
                        try {
                            this.loading = this.$loading.show()
                            this.fetch = true
                            // menghapus data pbb ke firestore database
                            await deleteDoc(doc(db, "pbb", this.detailMap.data.primary_id));
                            this.fetch = false
                            this.loading.hide()

                            // search data lokasi berdasarkan denah yang sedang di buka / aktif
                            const searchLocation = findIndex(this.allPolygons, { primary_id: this.detailMap.primary_id })
                            // search data ke variable, untuk mencari data PBB pada semua denah berdasarkan denah id
                            const indexPBB = findIndex(this.allPBB, {location_id: this.detailMap.id})

                            if (searchLocation >= 0) { // jika data ditemukan, maka data pbb akan dihapus
                                this.allPolygons[searchLocation].data = []
                            } if (indexPBB >= 0) {
                                this.allPBB.splice(indexPBB, 1) // hapus data pbb pada variable PBB
                            }

                            // reset / tutup tampilan detail kepemilikan PBB
                            this.detailMap = {
                                data: {}
                            }
                            this.showDetail = false
                            this.$toast.success('Data berhasil dihapus');
                        } catch(error) {
                            this.fetch = false
                            console.log(error);
                            
                            this.$toast.error(error);
                        }
                    }
                });
        },
        onSelectedAutocomplete(data) {
            // event terpilih nya pemilik PBB pada form auto complete
            this.ownerSelected = data

            this.setSelectedPolygonByOwner() // ubah warna denah menjadi jingga
        },
        getLocationFromOwner() {
            // mencari semua denah sesuai dengan data kepemilikan PBB berdasarkan nama pemilik pajak
            const result = this.allPBB.filter(item => {
                // toLowerCase() = untuk mengubah huruf menjadi kecil semua contoh AaaAa ==> aaaaa
                if (item.taxpayer_name.toLowerCase().includes(this.ownerSelected.name.toLowerCase())) {
                    return item
                }
            }).map(data => (data.location_id))

            return result
        },
        setSelectedPolygonByOwner() { // mengubah warna denah menjadi ke jingga ketika proses pencarian pemilik pajak
            const locationByOwner = this.getLocationFromOwner()
            this.polygons.filter(item => {
                if (includes(locationByOwner, item.options.id)) {
                    item.setStyle({
                        color: "orange", // Ubah warna garis menjadi oren
                        fillColor: "rgba(255, 165, 0, 1)", // Ubah warna isi menjadi oren dengan transparansi
                    });
                }
            })
        },
        closeDetailPBB() { // menutup tampilan detail kempilikan PBB
            this.showDetail = !this.showDetail
            this.resetSelectedPolygon()
        },
        async fetchDataKopak() {
            // mengambil semua data kopak untuk daftar kopak lainna
            try {
                this.loading = this.$loading.show()

                // query untuk select data kopak
                const kopakQuery = query(
                    collection(db, "kopak"),
                    orderBy("createdAt", 'asc'),
                );
                const kopakSnapshot = await getDocs(kopakQuery); // memproses query               
                this.listKopak = kopakSnapshot.docs // mengambil data setelah query berhasil diproses
                .map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }))
            } catch (e) {
                console.log("Error fetching documents: " + e.message);
            } finally {
                this.loading.hide()
            }
        },
        async openKopak(id) {
            // membuka kopak yang dipilih pada daftar kopak lainnya
            this.$router.replace({ name: 'kopak.information', params: { id } });
        }
    },
    beforeDestroy() {
        // Hapus peta saat halaman dihapus / ditutup
        if (this.initialMap) {
            this.initialMap.remove();
        }
    },
}
</script>