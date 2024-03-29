import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.css'],
})
export class StatusComponent implements OnInit {
  @Input('status') status: string;

  ngOnInit(): void {}

  getStatus() {
    return this.status.toLowerCase();
  }
}
