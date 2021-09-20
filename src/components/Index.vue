<template>
  <div class="row no-gutters">
    <div class="col-sm-4 p-0">
      <div class="toolbox">
        <div class="sticky-top shadow-sm p-2">
          <div class="form-group d-flex">
            <label for="county" class="mx-2 col-form-label text-right">縣市</label>
            <div class="flex-fill">
              <select
                @change="getCountyData"
                id="county"
                class="form-select"
                v-model="countyName"
              >
                <option selected disabled value="">-- 請選擇縣市 --</option>
                <option
                  v-for="(item, index) in county"
                  :key="index"
                  :value="item"
                >
                  {{ item }}
                </option>
              </select>
            </div>
          </div>
          <div class="form-group mt-2 d-flex">
            <label for="area" class="mx-2 col-form-label text-right"
              >地區</label
            >
            <div class="flex-fill">
              <select
                @change="getTownData"
                id="area"
                class="form-select"
                v-model="townName"
              >
                <option selected disabled value="">-- 請選擇地區 --</option>
                <option
                  v-for="(item, index) in town"
                  :key="index"
                  :value="item"
                >
                  {{ item }}
                </option>
              </select>
            </div>
          </div>
          <p class="mb-0 mt-2 small text-muted text-center">
            請先選擇區域查看（綠色表示還有口罩）
          </p>
        </div>
        <ul class="list-group">
          <li
            class="list-group-item text-left p-md-4"
            :class="{}"
            v-for="(item, index) in displayList"
            :key="index"
            @click="penTo(item)"
          >
            <h4>{{ item.properties.name }}</h4>
            <div class="address-wrap">
              <i class="fas fa-map-marker-alt"></i>
              <p class="d-inline m-3">
                <a target="_blank" :href="`https://www.google.com.tw/maps/place/${item.properties.address}`">
                  {{ item.properties.address }}
                </a>
              </p>
            </div>
            <div class="phone-wrap">
              <i class="fas fa-phone-alt"></i>
              <p class="d-inline m-2">
                {{ item.properties.phone }}
              </p>
            </div>
            <div class="time-wrap">
              <i class="fas fa-clock"></i>
              <p class="d-inline m-2">
                {{ item.properties.note }}
              </p>
            </div>
            <div
              class="d-flex flex-lg-row flex-md-column justify-content-around align-items-center mt-2 text-center">
              <p style="width: 150px" class="mb-0 p-2 text-light rounded-2">
                成人口罩：{{ item.properties.mask_adult }}
              </p>
              <p style="width: 150px" class="mb-0 mt-lg-0 mt-md-2 p-2 text-light rounded-2">
                兒童口罩：{{ item.properties.mask_child }}
              </p>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="col-sm-8 p-0">
      <div id="map"></div>
    </div>
  </div>
</template>
<script>
import { computed, ref, onMounted, inject } from "vue";
import L from "leaflet";
import 'leaflet/dist/leaflet.css';

let osmMap = {};
const osm = {
  removeMapMarker() {
    osmMap.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        osmMap.removeLayer(layer);
      }
    });
  },
};
export default {
  name: 'Index',
  setup() {
    const axios = inject("axios");
    const data = ref([]);
    const countyName = ref("");
    const countyData = ref([]);
    const townName = ref("");
    const townData = ref([]);
    // 創建地圖
    const createOsmMap = () => {
      osmMap = L.map("map", {
        center: [25.03, 121.55],
        zoom: 15,
      });
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18,
      }).addTo(osmMap);
    };
    // 新增藥局標記點及綁定顯示的彈跳視窗
    const createMarker = (geometry, properties) => {
      L.marker([geometry.coordinates[1], geometry.coordinates[0]])
        .addTo(osmMap)
        .bindPopup(
          `
          <h5>${properties.name}</h5>
          口罩剩餘數量: 
          <strong>
            成人: ${properties.mask_adult} / 小孩: ${properties.mask_child}
          </strong>
          <br>
          地址: <a target="_blank" href="https://www.google.com.tw/maps/place/${properties.address}">${properties.address}</a>
          <br>
          電話: ${properties.phone}
          <br>
          <small>最後更新時間: ${properties.updated}</small>
        `
        )
        .openPopup();
    };
    // 接取遠端資料
    const getJsonData = () => {
      const url =
        "https://raw.githubusercontent.com/kiang/pharmacies/master/json/points.json";
      axios.get(url).then((res) => {
        data.value = res.data.features;
      });
    };
    // 取得縣市資料
    const getCountyData = () => {
      osm.removeMapMarker();
      countyData.value = data.value.filter((item) => {
        return item.properties.county === countyName.value;
      });
      penTo(countyData.value[0]);
      townName.value = "";
    };
    // 取得地區資料
    const getTownData = () => {
      osm.removeMapMarker();
      townData.value = countyData.value.filter((item) => {
        return item.properties.town === townName.value;
      });
      townData.value.forEach((item) => {
        const { geometry, properties } = item;
        createMarker(geometry, properties);
      });
      penTo(townData.value[0]);
    };
    // 地圖移動到點擊的藥局
    const penTo = (item) => {
      const { geometry, properties } = item;
      osmMap.panTo([geometry.coordinates[1], geometry.coordinates[0]]);
      createMarker(geometry, properties);
    };
    // 過濾縣市名字
    const county = computed(() => {
      const arr = [];
      data.value.forEach((item) => {
        arr.push(item.properties.county);
      });
      return arr.filter((item, index) => arr.indexOf(item) === index);
    });
    // 過濾地區名字
    const town = computed(() => {
      const arr = [];
      countyData.value.forEach((item) => {
        arr.push(item.properties.town);
      });
      return arr.filter((item, index) => arr.indexOf(item) === index);
    });
    // 最終呈現在左側 list 上的資料
    const displayList = computed(() => {
      if (countyName.value !== "") {
        if (townName.value !== "") {
          return townData.value;
        }
        return countyData.value;
      }
    });
    onMounted(() => {
      getJsonData();
      createOsmMap();
    });
    return {
      countyName,
      townName,
      county,
      town,
      getCountyData,
      getTownData,
      displayList,
      penTo,
    };
  },
};
</script>
<style lang="scss" scoped>
@import "bootstrap/scss/bootstrap";

#map {
  height: 100vh;
}

.highlight {
  background: #e9ffe3;
}

.toolbox {
  height: 100vh;
  overflow-y: auto;
  li {
    cursor: pointer;
  }
  p {
    white-space: nowrap;
    overflow: hidden;
    text-overflow:ellipsis;
  }
}
</style>
