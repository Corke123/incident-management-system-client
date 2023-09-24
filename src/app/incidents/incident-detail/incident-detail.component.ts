import { Component, OnInit } from '@angular/core';
import { IncidentService } from '../incident.service';
import { Incident } from '../incident.model';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { KeycloakService } from 'keycloak-angular';
import { SnackbarService } from 'src/app/shared/snackbar/snackbar.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { TranslationService } from 'src/app/shared/translation/translation.service';
import { TranslationResponse } from 'src/app/shared/translation/translation-response.model';

@Component({
  selector: 'app-incident-detail',
  templateUrl: './incident-detail.component.html',
  styleUrls: ['./incident-detail.component.css'],
})
export class IncidentDetailComponent implements OnInit {
  incident: Incident;
  isModerator = false;
  translatedDescription = '';

  constructor(
    private incidentService: IncidentService,
    private snackbarService: SnackbarService,
    private translationService: TranslationService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private keycloakService: KeycloakService
  ) {}

  ngOnInit(): void {
    this.route.params
      .pipe(
        switchMap((params) =>
          this.incidentService.getIncidentById(params['id'])
        )
      )
      .subscribe({
        next: (incident: Incident) => (this.incident = incident),
        error: () => this.router.navigate(['incidents', 'not-found']),
      });
    this.isModerator = this.keycloakService.isUserInRole('MODERATOR');
  }

  getStatus() {
    return this.incident.status.toLowerCase();
  }

  isPending() {
    return this.incident.status === 'PENDING';
  }

  approveIncident() {
    console.log('Showing dialog');
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: 'Are you sure that you want to approve incident?',
    });

    console.log('Dialog open, waiting for result');

    dialogRef.afterClosed().subscribe((result) => {
      console.log('dialog closed with result: ' + result);
      if (result) {
        this.incidentService
          .updateIncidentById(this.incident.id, 'APPROVED')
          .subscribe({
            next: (incident: Incident) => {
              this.incident = incident;
              this.snackbarService.showSnackBar('Incident approved');
            },
            error: () => {
              this.snackbarService.showSnackBar(
                'Error occurred while trying to approve incident'
              );
            },
          });
      }
    });
  }

  deleteIncident() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: 'Are you sure that you want to delete incident?',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.incidentService
          .updateIncidentById(this.incident.id, 'DELETED')
          .subscribe({
            next: (incident: Incident) => {
              this.incident = incident;
              this.snackbarService.showSnackBar('Incident deleted');
            },
            error: () => {
              this.snackbarService.showSnackBar(
                'Error occurred while trying to delete incident'
              );
            },
          });
      }
    });
  }

  onTranslate() {
    console.log('Translate description: ' + this.incident.description);
    this.translationService.translateText(this.incident.description).subscribe({
      next: (translationResponse: TranslationResponse) =>
        (this.translatedDescription = translationResponse.text),
      error: () =>
        this.snackbarService.showSnackBar('Unable to translate description'),
    });
  }
}
