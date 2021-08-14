<template>
  <div>
    <div class="container px-4 py-4">
      <h1 class="text-red-400 font-bold text-xl">
        Peramalan Jumlah Mahasiswa Baru UBP Karawang
      </h1>
      <p class="text-gray-400 font-sm">
        Pada halaman ini menggunakan metode Double Exponential Smoothing -
        Holt's Method dengan parameter pemulusan alpha = 0.9 dan beta = 0.9
      </p>

      <div class="grid grid-cols-2 gap-4 mt-5">
        <div>
          <table-pmb :dataset="pmb" />
        </div>
        <div>
          <p class="font-bold mt-5">
            Input Jumlah Mahasiswa Untuk Tahun Selanjutnya
          </p>

          <button
            class="bg-blue-500 text-white px-2 py-1 rounded  font-bold hover:bg-blue-800 mt-5"
            @click="addField"
          >
            Tambah Tahun
          </button>
          <div v-for="(input, index) in addData" :key="index" class="mb-3">
            <label for="tahun" class="mr-3"
              >Jumlah Mahasiswa Tahun {{ 2021 + index }}:</label
            >
            <input
              type="text"
              style="border:1px solid #000"
              v-model="input.year"
            />

            <button
              class="bg-red-500 text-white px-2 py-1 rounded ml-3 font-bold hover:bg-red-800"
              @click="removeField(index)"
              v-show="addData.length > 1"
            >
              x
            </button>
          </div>
          <button
            class="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-800 ml-3"
            @click="desWithAddData"
          >
            Submit
          </button>
          <button
            class="bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-800 ml-3"
            @click="resetData"
          >
            Reset to Default Data
          </button>
        </div>
      </div>

      <div class="container mx-auto">
        <h1 class="font-bold text-xl">
          Hasil Peramalan
        </h1>
        <p>
          Jumlah Mahasiswa Tahun
          <b class="text-red-500"> {{ forecastNextPeriod }} </b> orang
        </p>
        <p class="mt-5">Dengan rincian perhitungan sebagai berikut:</p>
        <table-forecast-des-holt
          :dataset="forecast.dataset"
          :mse="forecast.mse"
          :mad="forecast.mad"
          :mape="forecast.mape"
        />
      </div>
    </div>
  </div>
</template>

<script>
import dataset from "../../utils/dataset";
import TablePmb from "../../components/TablePmb.vue";
import DESHolt from "../../utils/forecast/exponential-smoothing/des-holt";
import TableForecastDesHolt from "../../components/TableForecastDesHolt";
import { MSE, MAD, MAPE } from "../../utils/forecast/error";

export default {
  data() {
    return {
      pmb: [],
      addData: [{ year: "" }],
      forecast: {
        dataset: [],
        mse: 0,
        mad: 0,
        mape: 0,
      },
      forecastNextPeriod: "",
    };
  },

  components: {
    TablePmb,
    TableForecastDesHolt,
  },

  mounted() {
    this.pmb = dataset;

    const result = DESHolt(dataset, 0.9, 0.9);

    this.forecast = {
      dataset: result,
      mse: MSE(result),
      mad: MAD(result),
      mape: MAPE(result).toFixed(2),
    };

    const { period, result: nextForecast } = result[result.length - 1];

    this.forecastNextPeriod = `${period} : ${nextForecast}`;
  },

  methods: {
    resetData() {
      this.$router.go();
    },
    addField() {
      this.addData.push({ year: "" });
    },
    removeField(index) {
      this.addData.splice(index, 1);
    },
    desWithAddData() {
      const arrayYear = JSON.parse(JSON.stringify(this.addData));

      let currentYear = 2020;
      for (let index = 0; index < arrayYear.length; index++) {
        let yearToString = currentYear + 1;

        if (isNaN(arrayYear[index].year)) {
          alert(`Inputan untuk tahun ${yearToString} bukan berupa angka!`);
        } else {
          dataset.push({
            period: yearToString.toString(),
            qty: parseInt(arrayYear[index].year),
          });

          currentYear++;
        }
      }

      const result = DESHolt(dataset, 0.9, 0.9);

      this.forecast = {
        dataset: result,
        mse: MSE(result),
        mad: MAD(result),
        mape: MAPE(result).toFixed(2),
      };
    },
  },
};
</script>

<style></style>
