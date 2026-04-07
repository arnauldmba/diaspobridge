import { ApplicationRef, Injectable, inject } from '@angular/core';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { MatSnackBar } from '@angular/material/snack-bar';
import { concat, interval } from 'rxjs';
import { filter, first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PwaUpdateService {
  private readonly appRef = inject(ApplicationRef);
  private readonly updates = inject(SwUpdate);
  private readonly snackBar = inject(MatSnackBar);

  init(): void {
    if (!this.updates.isEnabled) {
      return;
    }

    this.updates.versionUpdates
      .pipe(
        filter((event): event is VersionReadyEvent => event.type === 'VERSION_READY')
      )
      .subscribe(() => {
        const snack = this.snackBar.open(
          'Une nouvelle version est disponible.',
          'Mettre à jour',
          { duration: 10000 }
        );

        snack.onAction().subscribe(() => {
          //window.location.reload();
          this.updates.activateUpdate().then(() => {
            document.location.reload();
          });
        });
      });

    const appIsStable$ = this.appRef.isStable.pipe(first(isStable => isStable));

    concat(appIsStable$, interval(6 * 60 * 60 * 1000)).subscribe(() => {
      this.updates.checkForUpdate();
    });
  }
}