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

                                    <!-- <div class="page-title-right">
                                        <ol class="breadcrumb m-0">
                                            <li class="breadcrumb-item"><a href="javascript: void(0);">Horizontal</a></li>
                                            <li class="breadcrumb-item active">Default</li>
                                        </ol>
                                    </div> -->

                                </div>
                            </div>
                        </div>
                        <!-- statistic resident by card -->
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
                                            <h6 class="fw-bold text-primary text-end">{{ detailKopak.totalWP || '-' }}</h6>
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
                                            <div class="header-map mb-3" v-if="!searchBarVisible">
                                                <Autocomplete class="w-100" :source="dataAutoComplete" v-model="ownerName" :placeholder="'Cari kepemilikian PBB disini sesuai nama pemilik'" @onSelectedAutocomplete="onSelectedAutocomplete" />
                                                <!-- <button class="btn btn-primary custom-rounded-medium mb-2 ms-2 flex-shrink-0" @click="toggleSearchBar">{{ searchBarVisible ? 'Cari Berdasarkan Pemilik PBB' : 'Cari Berdasarkan Alamat' }}</button> -->
                                            </div>
                                            <div class="custom-rounded-medium mb-3" style="height: 600px; width: 100%; z-index: 1;" id="map" :class="{'d-flex align-items-center justify-content-center bg-light': !this.detailKopak.latitude || !this.detailKopak.longitude}">
                                                <!-- <div v-if="!this.detailKopak.latitude || !this.detailKopak.longitude" class="text-muted text-center" style="line-height: 30px">
                                                    <img src="@/assets/images/map.png" width="150" class="mb-3" />
                                                    <div class="fs-5 f-bold">
                                                        Kopak Belum Memiliki Titik Koordinat
                                                    </div>
                                                    <div class="mb-3">
                                                        Silahkan atur titik koordinat latitude dan longitude terlebih dahulu untuk menampilkan map.
                                                    </div>
                                                    <router-link :to="`/master-kopak/form/${id}`" class="btn btn-primary custom-rounded-medium">Atur Lokasi Kopak</router-link>
                                                </div> -->
                                            </div>
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
                                                        <div>Lokasi</div>
                                                        <div class="h6">{{ findLocation?.title }}</div>
                                                    </div>
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
                                                        <div>Kopak</div>
                                                        <div class="h6">{{ detailKopak?.name }}</div>
                                                    </div>
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
                                        <router-link :to="`/master-kopak/form/detail/${id}/${detailMap.id}/${detailMap.data.primary_id}`" class="btn btn-primary custom-rounded-medium">Edit Data PBB</router-link>
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
import simplebar from 'simplebar-vue';
import 'simplebar-core/dist/simplebar.css';

import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import "leaflet-fullscreen/dist/leaflet.fullscreen.css";
import "leaflet-search/dist/leaflet-search.min.css";

import L from "leaflet";
import 'leaflet-draw';
import "leaflet-fullscreen";
import "leaflet-search";

import { Field, Form, ErrorMessage } from 'vee-validate';

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
            searchBarVisible: false,
            listKopak: []
        }
    },
    watch: {
        ownerName(value) {
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
        '$route.params.id'(newId) {
            this.id = newId;

            this.$router.replace({ path: '/' })
            setTimeout(() => {
                this.$router.replace('/kopak/detail/' + newId);
            }, 100);
        },
    },
    components: {
        simplebar, Field, Form, ErrorMessage, Autocomplete
    },
    computed: {
        findLocation() {
            return find(this.allPolygons, { id: this.detailMap?.data?.location_id })
        }
    },
    async mounted() {
        if (this.id) {
            this.detailKopak = await this.fetchDetailKopak(this.id);
            this.detailKopak.latitude = -7.3831153
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
        async fetchDetailKopak(id) {
            const dataDoc = await getDoc(doc(db, "kopak", id));
            
            if (dataDoc.exists()) {
                const data = dataDoc.data();

                return data
            } else {
                return {}
            }
        },
        async fetchDataLocation() {
            try {
                this.loading = this.$loading.show()
                const usersQuery = query(
                    collection(db, "location"),
                    // where('kopak_id', '==', this.id)
                );
                const querySnapshot = await getDocs(usersQuery);                
                const dataList = querySnapshot.docs
                .map(doc => ({
                    primary_id: doc.id,
                    id: doc.data().id,
                    kopak_id: doc.data().kopak_id,
                    is_owner: doc.data().kopak_id == this.id,
                    points: JSON.parse(doc.data().points),
                    title: doc.data().title,
                }))
                
                this.allPolygons = dataList
            } catch (e) {
                console.log("Error fetching documents: " + e.message);
            } finally {
                this.loading.hide()
            }
        },
        async fetchDataPBB() {
            try {
                this.loading = this.$loading.show()
                
                const ids = map(this.allPolygons, 'id'); // Mengambil ID dari allPolygons
                const batchSize = 30; // Maksimum jumlah ID per query
                const chunks = chunk(ids, batchSize); // Membagi ID menjadi batch
                
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
                const indexPBB = findIndex(this.allPBB, {location_id: locationId})
                
                if (indexPBB > -1) {
                    this.detailMap.data = this.allPBB[indexPBB]
                } else {
                    this.detailMap.data = []
                }
            } catch (e) {
                console.log("Error fetching documents: " + e.message);
            }
        },
        async initMap() {
            this.initialMap = L.map("map", {
                zoomControl: false,
                zoomAnimation: true,
                fadeAnimation: true,
                markerZoomAnimation: false,
                crs: L.CRS.EPSG3857, // CRS default
            }).setView([this.detailKopak.latitude, this.detailKopak.longitude], 15);

            // L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            //     maxZoom: 19,
            //     attribution: "&copy; <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a>",
            // }).addTo(this.initialMap);

            // Google Maps Satellite Tile Layer
            const googleSatellite = L.tileLayer('https://mt{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
                subdomains: ['0', '1', '2', '3'], // Subdomain Google
                maxZoom: 21, // Set max zoom yang lebih tinggi
                attribution: '&copy; <a href="https://www.google.com/maps">Google Maps</a>',
            });

            // Tambahkan ke Peta
            googleSatellite.addTo(this.initialMap);

            // L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
            //     attribution: '&copy; <a href="https://www.openstreetmap.org/">2022</a>',
            //     maxZoom: 23,
            //     id: 'mapbox/satellite-streets-v11',
            //     tileSize: 512,
            //     zoomOffset: -1,
            //     accessToken: 'pk.eyJ1IjoiYW5vbnk3OTExIiwiYSI6ImNsYTZiYWwybzE2d2YzcnFxaWdvNGdsbHMifQ.LtkD7CYPKYyAmyXG6tqNbA'
            // }).addTo(this.initialMap);

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
            this.initialMap.addControl(drawControl);
            drawControl.setPosition('bottomleft'); // Mengatur posisi kontrol

            // Event ketika fitur digambar
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
                        dataEvent.options.is_owner = true
                        this.polygonClicked = dataEvent
                        this.showDetail = true
                        
                        this.detailMap = {
                            id: polygonId,
                            points: JSON.stringify(latlngs),
                            title: `Denah ${this.polygons.length + 1}`,
                            kopak_id: this.id,
                            kopak: this.detailKopak
                        }
                        this.setSelectedPolygon()
                        this.detailPBB(polygonId)
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
                    // const geoJSON = layer.toGeoJSON(); // Konversi layer ke GeoJSON
                    const dataPolygon = {
                        // points: JSON.stringify(geoJSON.geometry.coordinates),
                        points: JSON.stringify(this.getLatLngArray(layer)),
                    }

                    const detailLocation = find(this.allPolygons, { id: layer.options.id })
                    
                    await this.saveLocationToDatabase(dataPolygon, detailLocation.primary_id)
                });
            });
            
            // Event ketika fitur dihapus
            this.initialMap.on('draw:deleted', async (event) => {
                const layers = event.layers; // Semua layer yang diupdate
                // Iterasi secara berurutan menggunakan for...of
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

            // Event listener untuk masuk dan keluar fullscreen
            this.initialMap.on("enterFullscreen", () => {
                console.log("Peta dalam mode fullscreen");
            });

            this.initialMap.on("exitFullscreen", () => {
                console.log("Peta keluar dari mode fullscreen");
            });

            // ===================================================================================================================
            // =================================================== FITUR SEARCH MAP ================================================
            const map = this.initialMap
            this.searchControl = new L.Control.Search({
                url: "https://nominatim.openstreetmap.org/search?format=json&q={s}", // Endpoint Nominatim
                jsonpParam: "json_callback", // Mendukung JSONP
                propertyName: "display_name", // Properti untuk menampilkan hasil pencarian
                propertyLoc: ["lat", "lon"],  // Properti untuk lokasi koordinat
                moveToLocation(latlng, title, map) {
                    map.setView(latlng, 17); // Zoom ke hasil pencarian
                },
                autoType: false,  // Tidak otomatis mengetikkan hasil
                collapsed: false, // Tampilkan search bar langsung
                minLength: 2,     // Panjang minimum pencarian
            })

            // Event listener untuk menampilkan marker pada lokasi hasil pencarian
            this.searchControl.on("search:locationfound", (e) => {
                L.marker(e.latlng)
                    .addTo(this.initialMap)
                    .bindPopup(e.text)
                    .openPopup();
            });
            // ===================================================================================================================

            // Add area marker
            if (this.allPolygons) {
                this.allPolygons.forEach(element => {
                    const polygon = L.polygon(element.points, {
                        id: element.id,
                        color: element.is_owner ? "blue" : "#202020", // Warna garis tepi
                        fillColor: element.is_owner ? "rgba(0, 0, 255, 1)" : "rgba(0, 0, 0, 1)", // Warna isian (dengan transparansi)
                        fillOpacity: 0.5, // Tingkat transparansi isian
                        weight: 2
                    }).addTo(this.initialMap)
                    // .bindPopup('A pretty CSS popup.<br> Easily customizable.')
                    // .openPopup();

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
                const locationByOwner = this.getLocationFromOwner()
                if (this.ownerName && includes(locationByOwner, this.lastClickedPolygon.options.id)) {
                    this.setSelectedPolygonByOwner()
                } else {
                    this.lastClickedPolygon.setStyle({
                        color: this.lastClickedPolygon.options.is_owner ? "blue" : "#202020", // Warna garis tepi
                        fillColor: this.lastClickedPolygon.options.is_owner ? "rgba(0, 0, 255, 1)" : "rgba(0, 0, 0, 1)", // Warna isian (dengan transparansi)
                    });
                }
            }
        },
        async getSuppervisor() {
            // detailSupervisor
            const dataDoc = await getDoc(doc(db, "users", this.detailKopak.supervisorId));
            
            if (dataDoc.exists()) {
                const data = dataDoc.data();

                this.detailSupervisor = {
                    ...data
                }
            }
        },
        async saveLocationToDatabase(data, id=null) {
            try {
                this.fetch = true
                this.loading = this.$loading.show()

                if (id) {
                    await updateDoc(doc(db, "location", id), data);
                } else {
                    await addDoc(collection(db, "location"), {...data});
                }

                this.loading.hide()
                this.$toast.success('Data Berhasil Disimpan');

                await this.fetchDataLocation()
            } catch(error) {
                if (this.loading != null)
                    this.loading.hide()
                this.fetch = false

                let message = error.message || error.code
                this.$toast.error(message);

                console.log(message);
            }
        },
        async confirmDeleteLocation() {
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
                        this.deleteLocation(this.detailMap?.primary_id)
                    }
                });
        },
        async deleteLocation(id) {
            try {
                this.loading = this.$loading.show()
                this.fetch = true
                if (id) {
                    await deleteDoc(doc(db, "location", id));
                }

                if (this.polygonClicked) {
                    const searchIndex = findIndex(this.polygons, (data) => data.options.id == this.polygonClicked.options.id);
                    
                    if (searchIndex >= 0) {
                        if (this.polygons.length) {
                            // Iterasi semua polygon dan hapus dari peta
                            this.initialMap.removeLayer(this.polygons[searchIndex]);

                            // Kosongkan array polygons
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
                            await deleteDoc(doc(db, "pbb", this.detailMap.data.primary_id));
                            this.fetch = false
                            this.loading.hide()

                            // search data
                            const searchLocation = findIndex(this.allPolygons, { primary_id: this.detailMap.primary_id })
                            const indexPBB = findIndex(this.allPBB, {location_id: this.detailMap.id})

                            if (searchLocation >= 0) {
                                this.allPolygons[searchLocation].data = []
                            } if (indexPBB >= 0) {
                                this.allPBB.splice(indexPBB, 1)
                            }

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
            this.ownerSelected = data

            this.setSelectedPolygonByOwner()
        },
        getLocationFromOwner() {
            const result = this.allPBB.filter(item => {
                if (item.taxpayer_name.toLowerCase().includes(this.ownerSelected.name.toLowerCase())) {
                    return item
                }
            }).map(data => (data.location_id))

            return result
        },
        setSelectedPolygonByOwner() {
            const locationByOwner = this.getLocationFromOwner()
            this.polygons.filter(item => {
                if (includes(locationByOwner, item.options.id)) {
                    item.setStyle({
                        color: "orange", // Ubah warna garis menjadi merah
                        fillColor: "rgba(255, 165, 0, 1)", // Ubah warna isi menjadi merah dengan transparansi
                    });
                }
            })
        },
        closeDetailPBB() {
            this.showDetail = !this.showDetail
            this.resetSelectedPolygon()
        },
        toggleSearchBar() {
            if (this.searchBarVisible) {
                // Hide search bar
                this.initialMap.removeControl(this.searchControl);
            } else {
                // Show search bar
                this.searchControl.addTo(this.initialMap);
            }
            this.searchBarVisible = !this.searchBarVisible; // Toggle status
        },
        async fetchDataKopak() {
            try {
                this.loading = this.$loading.show()

                const role = this.$store.state.user?.role
                const userId = this.$store.state.user?.id
                
                const kopakQuery = query(
                    collection(db, "kopak"),
                    orderBy("createdAt", 'asc'),
                );
                const kopakSnapshot = await getDocs(kopakQuery);                
                this.listKopak = kopakSnapshot.docs
                .map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }))
                .filter(data => {
                    if (role == 'staff')
                        if (data.staff.indexOf(userId) != -1)
                            return data
                    if (['superadmin', 'admin'].indexOf(role) != -1)
                        return data
                });
            } catch (e) {
                console.log("Error fetching documents: " + e.message);
            } finally {
                this.loading.hide()
            }
        },
        async openKopak(id) {
            this.$router.replace({ name: 'kopak.information', params: { id } });
        }
    },
    beforeDestroy() {
        // Hapus peta saat komponen dihapus
        if (this.initialMap) {
            this.initialMap.remove();
        }
    },
}
</script>