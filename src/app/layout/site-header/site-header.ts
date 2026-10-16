import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter } from 'rxjs';

type HeaderSection = 'home' | 'stories' | 'about' | null;

@Component({
  selector: 'app-site-header',
  imports: [RouterLink],
  templateUrl: './site-header.html',
  styleUrl: './site-header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SiteHeader {
  private readonly router = inject(Router);
  private readonly document = inject(DOCUMENT);

  private readonly menuButton = viewChild<ElementRef<HTMLButtonElement>>('menuButton');

  readonly isMenuOpen = signal(false);
  readonly activeSection = signal<HeaderSection>('home');

  constructor() {
    this.updateActiveSection();

    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe(() => {
        this.updateActiveSection();
        this.closeMenu();
      });
  }

  toggleMenu(): void {
    this.isMenuOpen.update((value) => !value);
  }

  closeMenu(returnFocus = false): void {
    this.isMenuOpen.set(false);

    if (returnFocus) {
      this.menuButton()?.nativeElement.focus();
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.isMenuOpen()) {
      this.closeMenu(true);
    }
  }

  @HostListener('window:resize')
  onResize(): void {
    const width = this.document.defaultView?.innerWidth;

    if (width !== undefined && width > 1080) {
      this.closeMenu();
    }
  }

  private updateActiveSection(): void {
    const tree = this.router.parseUrl(this.router.url);
    const segments = tree.root.children['primary']?.segments ?? [];

    if (segments.length > 0) {
      this.activeSection.set(null);
      return;
    }

    const fragment = tree.fragment;

    this.activeSection.set(
      fragment === 'stories' ? 'stories' : fragment === 'about' ? 'about' : 'home',
    );
  }
}
