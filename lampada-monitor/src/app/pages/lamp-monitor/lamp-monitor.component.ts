import { Component } from '@angular/core';
import { LampService } from '../../core/lamp.service';
import { Subscription, interval } from 'rxjs';
import { ChartConfiguration, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-lamp-monitor',
  templateUrl: './lamp-monitor.component.html',
  styleUrl: './lamp-monitor.component.scss',
})
export class LampMonitorComponent {
  lampType: number = 1;
  selectedLampType: number = 1;
  lampData: any = [];
  private updateSubscription!: Subscription;
  isUpdating: boolean = false;
  qntResultados: number = 10;
  errMsg: string = '';

  public lineChartData: ChartConfiguration<'line'>['data'] = {
    datasets: [],
    labels: [],
  };

  public lineChartDataVoltage: ChartConfiguration<'line'>['data'] = {
    datasets: [],
    labels: [],
  };

  public lineChartDataCurrent: ChartConfiguration<'line'>['data'] = {
    datasets: [],
    labels: [],
  };

  public lineChartDataPower: ChartConfiguration<'line'>['data'] = {
    datasets: [],
    labels: [],
  };

  public lineChartDataTemperature: ChartConfiguration<'line'>['data'] = {
    datasets: [],
    labels: [],
  };

  public lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    color: 'white',
    scales: {
      x: {
        ticks: {
          color: 'white',
        },
      },
      y: {
        ticks: {
          color: 'white',
        },
      },
    },
  };

  public lineChartOptionsVoltage: ChartOptions<'line'> = {
    responsive: true,
    color: 'white',
  };

  public lineChartOptionsCurrent: ChartOptions<'line'> = {
    responsive: true,
    color: 'white',
  };

  public lineChartOptionsPower: ChartOptions<'line'> = {
    responsive: true,
    color: 'white',
  };

  public lineChartOptionsTemperature: ChartOptions<'line'> = {
    responsive: true,
    color: 'white',
  };

  public lineChartLegend = true;

  constructor(private lampService: LampService) {}

  ngOnInit() {}

  startAutoUpdate() {
    this.updateSubscription = interval(15000).subscribe(() => {
      if (this.isUpdating) {
        this.saveData();

        setTimeout(() => {
          this.updateData();
        }, 1000);
      }
    });
  }

  stopAutoUpdate() {
    if (this.updateSubscription) {
      this.updateSubscription.unsubscribe();
    }
  }

  toggleAutoUpdate() {
    this.isUpdating = !this.isUpdating;
    if (this.isUpdating) {
      this.startAutoUpdate();
    } else {
      this.stopAutoUpdate();
    }
  }

  setLampType(): void {
    this.lampType = this.selectedLampType;
    this.stopAutoUpdate();
    this.isUpdating = false;
    this.lampService.setLampadaTipo(this.lampType).subscribe();
    this.updateData();
  }

  updateData(): void {
    let datasets = [
      {
        data: [],
        label: 'Tensão (V)',
        fill: false,
        backgroundColor: '#2196F3',
      },
      {
        data: [],
        label: 'Corrente (A)',
        fill: false,
        backgroundColor: '#4CAF50',
      },
      {
        data: [],
        label: 'Temperatura (°C)',
        fill: false,
        backgroundColor: '#FF9800',
      },
      {
        data: [],
        label: 'Potência (W)',
        fill: false,
        backgroundColor: '#FF5722',
      },
    ];

    let labels = [];

    this.lampService.getDadosPorTipo(this.lampType).subscribe(
      (data: any) => {
        this.lampData = data;

        const filteredData = this.lampData.slice(-this.qntResultados);

        const newLabels = filteredData.map(
          (d: { timestamp: string | number | Date }) =>
            new Date(d.timestamp).toLocaleTimeString()
        );
        labels = newLabels;

        datasets[0].data = filteredData.map((d: { voltage: any }) => d.voltage);
        datasets[1].data = filteredData.map((d: { current: any }) => d.current);
        datasets[2].data = filteredData.map(
          (d: { temperature: any }) => d.temperature
        );
        datasets[3].data = filteredData.map((d: { power: any }) => d.power);

        let minValues = datasets.map((dataset) => Math.min(...dataset.data));
        let maxValues = datasets.map((dataset) => Math.max(...dataset.data));

        minValues = minValues.map((value) => value * 0.8);
        maxValues = maxValues.map((value) => value * 1.2);

        this.lineChartOptionsVoltage.scales = {
          y: {
            ticks: {
              color: 'white',
            },
            min: Math.min(minValues[0]),
            max: Math.max(maxValues[0]),
          },
          x: {
            ticks: {
              color: 'white',
            },
          },
        };

        this.lineChartOptionsCurrent.scales = {
          y: {
            ticks: {
              color: 'white',
            },
            min: Math.min(minValues[1]),
            max: Math.max(maxValues[1]),
          },
          x: {
            ticks: {
              color: 'white',
            },
          },
        };

        this.lineChartOptionsTemperature.scales = {
          y: {
            ticks: {
              color: 'white',
            },
            min: Math.min(minValues[2]),
            max: Math.max(maxValues[2]),
          },
          x: {
            ticks: {
              color: 'white',
            },
          },
        };

        this.lineChartOptionsPower.scales = {
          y: {
            ticks: {
              color: 'white',
            },
            min: Math.min(minValues[3]),
            max: Math.max(maxValues[3]),
          },
          x: {
            ticks: {
              color: 'white',
            },
          },
        };

        this.lineChartData = {
          datasets: datasets,
          labels: labels,
        };

        this.lineChartDataVoltage = {
          datasets: datasets.slice(0, 1),
          labels: labels,
        };

        this.lineChartDataCurrent = {
          datasets: datasets.slice(1, 2),
          labels: labels,
        };

        this.lineChartDataTemperature = {
          datasets: datasets.slice(2, 3),
          labels: labels,
        };

        this.lineChartDataPower = {
          datasets: datasets.slice(3, 4),
          labels: labels,
        };
        
        this.errMsg = '';
      },
      (error) => {
        this.lampData = [];
        this.errMsg = 'Não foi possível se conectar ao serviço.';
      }
    );
  }

  saveData() {
    this.lampService.salvarDados().subscribe();
  }
}
