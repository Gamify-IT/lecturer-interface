import { ApexOptions } from "apexcharts";

export interface ChartToShow {
  enoughDataToShow: boolean;
  width: number;
  options: ApexOptions;
  series: Array<any>;
}
export interface LineChart extends ChartToShow {
  options: ApexOptions;
  series: Array<any>;
}

export interface PieChart extends ChartToShow {
  options: ApexOptions;
  series: Array<number>;
}
