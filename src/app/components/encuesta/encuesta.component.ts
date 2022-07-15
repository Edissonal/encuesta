import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

import DataLabelsPlugin from 'chartjs-plugin-datalabels';
import { HttpClient } from '@angular/common/http';
import { WebsocketService } from 'src/app/services/websocket.service';



@Component({
  selector: 'app-encuesta',
  templateUrl: './encuesta.component.html',
  styleUrls: ['./encuesta.component.css']
})
export class EncuestaComponent implements OnInit {

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  public barChartData: ChartData<'bar'> = {
    labels: [ 'Pregunta1', 'Pregunta2', 'Pregunta3', 'Pregunta4' ],
    datasets: [
      { data: [ 0, 0, 0, 0 ], label: 'Entrevistados' },    ]
  };


  constructor(private http:HttpClient,
              private WsSevices:WebsocketService) {
   }





  ngOnInit(): void {
    this.http.get('http://localhost:5000/grafica')
    .subscribe((data:any ) => {
      this.barChartData.datasets = data;
      console.log(this.barChartData);

     this.escucharSocket();
    });
  }

  escucharSocket(){
    this.WsSevices.listen('cambio-grafica')
    .subscribe( (data:any) => {
      console.log(data);
      this.barChartData.datasets = data;
      this.chart?.update();
    });

  }


  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: {
      x: {},
      y: {
        min: 10
      }
    },
    plugins: {
      legend: {
        display: true,
      },
      datalabels: {
        anchor: 'end',
        align: 'end'
      }
    }
  };

  public barChartType: ChartType = 'bar';
  public barChartPlugins = [
    DataLabelsPlugin
  ];


  // events
  public chartClicked({ event, active }: { event?: ChartEvent, active?: {}[] }): void {
 //   console.log(event, active);
  }

  public chartHovered({ event, active }: { event?: ChartEvent, active?: {}[] }): void {
  //  console.log(event, active);
  }


}
