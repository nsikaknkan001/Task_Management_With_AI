import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface RoadmapRequest {
  title: string;
  description: string;
  priority: string;
}

export interface RoadmapResponse {
  roadmap: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class AIRoadmapService {
  private apiUrl = 'http://localhost:8080/api/ai';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  generateRoadmap(request: RoadmapRequest): Observable<RoadmapResponse> {
    return this.http.post<RoadmapResponse>(`${this.apiUrl}/generate-roadmap`, request, this.getHttpOptions());
  }

  regenerateRoadmap(request: RoadmapRequest): Observable<RoadmapResponse> {
    return this.http.post<RoadmapResponse>(`${this.apiUrl}/regenerate-roadmap`, request, this.getHttpOptions());
  }

  private getHttpOptions() {
    const token = this.authService.getToken();
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
  }
}