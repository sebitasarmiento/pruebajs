const montoCLP = document.getElementById("ingresa-monto");
const monedaConvertir = document.getElementById("moneda-a-convertir");
const botonResultado = document.getElementById("btn");
const Resultado = document.getElementById("Resultado");

const URL = "https://mindicador.cl/api";

let cambioValor;
let chart;

async function getCambio() {
    try {
        const res = await fetch(URL);
        const data = await res.json();
        cambioValor = data;
        console.log(data);
    } catch (e) {
        Resultado.innerHTML = "Libreria no encontrada";
    }
}
getCambio();

botonResultado.addEventListener("click", () => {
    const cambioSelec = monedaConvertir.value;
    const clpMonto = parseFloat(montoCLP.value);

    if (cambioSelec === "1" && cambioValor) {
        const clpUSD = cambioValor.dolar.valor;
        const montoConvertido = clpMonto / clpUSD;
        Resultado.innerHTML = `${clpMonto} CLP = ${montoConvertido.toFixed(2)} USD`;

        renderChart("Dolar");
    } else if (cambioSelec === "2" && cambioValor) {
        const clpEUR = cambioValor.euro.valor;
        const montoConvertido = clpMonto / clpEUR;
        Resultado.innerHTML = `${clpMonto} CLP = ${montoConvertido.toFixed(2)} EUR`;

        renderChart("Euro");
    } else {
        Resultado.innerHTML = "Seleccione una moneda válida y espere a que se carguen los datos de cambio.";
    }
});

function renderChart(currency) {
    let apiUrl;
    if (currency === "Dolar") {
        apiUrl = "https://mindicador.cl/api/dolar";
    } else if (currency === "Euro") {
        apiUrl = "https://mindicador.cl/api/euro";
    }

    async function fetchCurrencyData() {
        try {
            const res = await fetch(apiUrl);
            const data = await res.json();
            updateChart(data.serie);
        } catch (e) {
            Resultado.innerHTML = `Fallo el chart de ${currency}`;
        }
    }

    fetchCurrencyData();
}

function updateChart(data) {
    if (data && chart) {
        const valores = data.map((item) => item.valor);
        chart.updateSeries([{ data: valores }]);
    }
}

const options = {
    series: [
        {
            name: "Currency Exchange Rate",
            data: [],
        },
    ],
    chart: {
        height: 350,
        type: "line",
        zoom: {
            enabled: false,
        },
    },
    dataLabels: {
        enabled: false,
    },
    stroke: {
        curve: "straight",
    },
    title: {
        text: "Currency Exchange Rate Over Time",
        align: "left",
    },
    grid: {
        row: {
            colors: ["#f3f3f3", "transparent"],
            opacity: 0.5,
        },
    },
    xaxis: {
        categories: [],
    },
};

chart = new ApexCharts(document.querySelector("#chart"), options);
chart.render();
