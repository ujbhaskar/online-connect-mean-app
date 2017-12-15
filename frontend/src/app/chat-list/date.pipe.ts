import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'localdate'
})
export class  LocalDatePipe implements PipeTransform {
	getMonthName(num){
		var month = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
		return month[num];
	}
	getFullDate(dateStr){
		return  new Date(dateStr).getDate() + ' ' + this.getMonthName(new Date(dateStr).getMonth()) + ' ' + new Date(dateStr).getFullYear() + ' ' + this.getTimeFormat(new Date(dateStr));
	}
	getTimeFormat(date){
		var HH = date.getHours();
		var MIN = date.getMinutes();
		var ap = HH>12?'PM':'AM';
		HH = HH%12;
		HH = HH<10?'0'+HH:HH;
		MIN = MIN<10?'0'+MIN:MIN;
		var time = HH+':'+MIN+' '+ap;
		return time;
	}
	transform(value: string): string {
		// var date = new Date(value);
		// console.log(date);
		return this.getFullDate(value);

	}
}