import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { CacheService } from '@delon/cache';
import { ApiService } from '@core/utility/api-service';
import { Router } from '@angular/router';
import { interval } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
  selector: 'edit-password',
  templateUrl: './edit-password.component.html',
  styleUrls: ['./edit-password.component.css']
})
export class EditPasswordComponent implements OnInit {
  validateForm: FormGroup;
  oldpasswordVisible = false;
  passwordVisible = false;
  checkPasswordVisible = false;
  Complexity = 0;
  strokeColor ='red'; 
  public errorApp = '';
  submitForm(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
  }

  constructor(private fb: FormBuilder, private router: Router, private cacheService: CacheService,  private apiService: ApiService) { }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      userName: [null, [Validators.required]],
      oldpassword: [null, [Validators.required]],
      password: [null, [Validators.required, this.passconentValidator]],
      checkPassword: [null, [Validators.required, this.confirmationValidator]],
      remember: [true]
    });

    
    let accountobj = this.cacheService.getNone('_loginName');
   // console.log('用户信息',accountobj);
    if(accountobj){
      this.validateForm.controls.userName.setValue(accountobj);
    }
  }

  updateConfirmValidator(): void {
    /** wait for refresh value */
    Promise.resolve().then(() => this.validateForm.controls.checkPassword.updateValueAndValidity());
    this.ComplexityPass(this.validateForm.controls.password.value);
  }

  confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.validateForm.controls.password.value) {
      return { confirm: true, error: true };
    }
    return {};
  };



  passconentValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    }
    else if (!this.PassMinLength(control.value)) {
      return { minlength: true, error: true };
    }
    else if (!this.PassMaxLength(control.value)) {
      return { maxlength: true, error: true };
    }
    else if (this.checkPass(control.value) < 2) {
      return { confirmconent: true, error: true };
    }
    else if (control.value === this.validateForm.controls.oldpassword.value) {
      return { agreement: true, error: true };
    }
    return {};
  };


  ComplexityPass(pass) {

    var ls = 0;
    if (pass.match(/([a-zA-Z])+/)) { ls++; }
    if (pass.match(/([0-9])+/)) { ls++; }
    if (pass.match(/[^a-zA-Z0-9]+/)) { ls++; }
    this.Complexity = (ls * 34) > 100 ? 100 : (ls * 34);
    if(this.Complexity<60){
      this.strokeColor='red';
    }
    if(this.Complexity>60 && this.Complexity<69 ){
      this.strokeColor='#87d068';
    } 
    if(this.Complexity>69){
      this.strokeColor='#108ee9';
    } 
  }

  ComplexityPass0ld(pass) {

    var ls = 0;
    if (pass.match(/([a-z])+/)) { ls++; }
    if (pass.match(/([0-9])+/)) { ls++; }
    if (pass.match(/([A-Z])+/)) { ls++; }
    if (pass.match(/[^a-zA-Z0-9]+/)) { ls++; }
    this.Complexity = (ls * 25) > 100 ? 100 : (ls * 25);
  }

  PassMinLength(pass) {

    if (pass.length < 8) { return 0; }
    else { return 1 };
  }
  PassMaxLength(pass) {

    if (pass.length > 36) { return 0; }
    else { return 1 };
  }


  checkPass(pass) {

    var ls = 0;
    if (pass.match(/([a-z])+/)) { ls++; }
    if (pass.match(/([0-9])+/)) { ls++; }
    if (pass.match(/([A-Z])+/)) { ls++; }
    if (pass.match(/[^a-zA-Z0-9]+/)) { ls++; }
    return ls;
  }

  getCaptcha(e: MouseEvent): void {
    e.preventDefault();
  }

  public async _updatePwd() {
    if(!this.validateForm.controls.userName.value){
        return null;
    }
    let userLogin = {
      "loginName":this.validateForm.controls.userName.value,
      "loginPwd": this.validateForm.controls.oldpassword.value,
      "password":this.validateForm.controls.password.value,
      "confirmPassword":this.validateForm.controls.checkPassword.value,
    }    
    return this.apiService.updatePwd('common/user/account/pwd/updateSelfNoLogin', userLogin).toPromise();
  }

  async submitPwd(){
    this.errorApp = '';
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    if(!this.validateForm.valid) {
           return true;
    }
    const user = await this._updatePwd();
    if (user.isSuccess) {
     // console.log('修改密码成功');
  
      const numbers = interval(1000);
      const takeFourNumbers = numbers.pipe(take(3));
      takeFourNumbers.subscribe(
        x => {
      
          this.showError("您的密码修改成功！"+(3-x)+"秒后跳转至登录页面");
        },
        error => {},
        () => {
          let newurl = '/passport/login';
          this.router.navigate([`${newurl}`]);
       });     
      return true;
    }else{
      this.showError('修改密码失败'+ (user.message?user.message:''));
    }
   // console.log('提交数据');
  }

  public showError(errmsg) {
    this.errorApp = errmsg;
  }

}
