import { Component } from '@angular/core';
import { InputText } from 'primeng/inputtext';
import { Password } from 'primeng/password';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [InputText, Password, Button, Card],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {}
