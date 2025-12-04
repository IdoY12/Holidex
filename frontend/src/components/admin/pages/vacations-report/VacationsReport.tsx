import { useEffect, useState } from "react";
import useService from "../../../../hooks/use-service";
import ReportsService from "../../../../services/auth-aware/reportsService";
import type ReportGraph from "../../../../models/ReportGraph";
import {
    Chart as ChartJS,
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
} from "chart.js";
import type { ChartOptions } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Bar } from "react-chartjs-2";
import "./VacationsReport.css";
import useTitle from "../../../../hooks/use-title";

ChartJS.register(
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
    ChartDataLabels
)

export default function VacationsReport() {

    const reportsService = useService(ReportsService)
    const [data, setData] = useState<ReportGraph[]>([])

    useTitle("Vacations Reports")

    const download = () => reportsService.downloadCsv()

    useEffect(() => {
        ( async () => {
            const response = await reportsService.getReports()
            setData(response.map(r => {
                const { likes, ...rest } = r
                return { ...rest, likes: Number(likes) }
            }))
        })()
    }, [reportsService])

    const labels = data.map(({ destination }) => destination)
    const counts = data.map(({ likes }) => likes)

    const chartData = {
        labels,
        datasets: [
            {
                label: "Likes",
                data: counts,
                backgroundColor: "rgba(76, 110, 245, 0.8)",
                borderRadius: 8,
                barThickness: 28
            }
        ]
    };

    const chartOptions: ChartOptions<"bar"> = {
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
        plugins: {
            datalabels: {
                color: "#222",
                anchor: "end",
                align: "end",
                font: {
                    size: 12,
                    weight: "bold"
                }
            },
            legend: { display: true },
            tooltip: { enabled: true }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: { precision: 0 }
            },
            x: {
                ticks: {
                    maxRotation: 45,
                    minRotation: 45
                }
            }
        }
    }

    return (
        <div className="report-container">

            <h2 className="report-title">Vacations Likes Report</h2>

            <div className="download-btn-wrapper">
                <button onClick={download} className="btn btn-gradient px-4 py-2 rounded-4 shadow">
                    Download CSV
                </button>
            </div>

            <div className="chart-scroll-container">
                <div className="chart-width-controller">
                    <Bar data={chartData} options={chartOptions} />
                </div>
            </div>

        </div>
    )
}
