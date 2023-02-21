import { LightningElement } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { createRecord } from 'lightning/uiRecordApi';
import  STUDENT_OBJECT  from '@salesforce/schema/student__c';
import  STUDENT_IME from '@salesforce/schema/student__c.student_ime__c';
import  STUDENT_PRIIMEK  from '@salesforce/schema/student__c.student_priimek__c';
import  STUDENT_DATUMROJSTVA  from '@salesforce/schema/student__c.datum_rojstva__c';
import  STUDENT_EMAIL  from '@salesforce/schema/student__c.email__c';
import  STUDENT_EMSO from '@salesforce/schema/student__c.emso__c';
import  STUDENT_VRSTASTUDIJA  from '@salesforce/schema/student__c.vrsta_studija__c';
import  STUDENT_NASLOV  from '@salesforce/schema/student__c.naslov__c';
import  STUDENT_PLACNIK  from '@salesforce/schema/student__c.placnik__c';
import  STUDENT_TELEFON  from '@salesforce/schema/student__c.telefon__c';
import ValidateEmsoApex  from '@salesforce/apex/EmsoValidationClass.getValidateEmsoApex';

export default class VnosStudentaSt3 extends LightningElement {
    Student = STUDENT_OBJECT;
    StudentFields = [STUDENT_IME, STUDENT_PRIIMEK, STUDENT_DATUMROJSTVA, STUDENT_EMAIL, STUDENT_EMSO, STUDENT_NASLOV, STUDENT_TELEFON];

    visiblePlacnik = false;
    isEmsoValid = false;
    // object properties
    studentEmso = "";
    studentIme = "";
    studentPriimek = "";
    studentEmail = "";
    studentVrstaStudija = "Redni studij";
    studentNaslov = "";
    studentPlacnik = false;
    studentTelefon = "";
    studentDatumRojstva = "";
    

    createStudent(){
        const fields = {};
        fields[STUDENT_IME.fieldApiName] = this.studentIme;
        fields[STUDENT_PRIIMEK.fieldApiName] = this.studentPriimek;
        fields[STUDENT_DATUMROJSTVA.fieldApiName] = this.studentDatumRojstva;
        fields[STUDENT_EMAIL.fieldApiName] = this.studentEmail;
        fields[STUDENT_EMSO.fieldApiName] = this.studentEmso;
        fields[STUDENT_VRSTASTUDIJA.fieldApiName] = this.studentVrstaStudija;
        fields[STUDENT_NASLOV.fieldApiName] = this.studentNaslov;
        if(this.studentVrstaStudija !== 'Redni studij'){
            fields[STUDENT_PLACNIK.fieldApiName] = this.studentPlacnik;
        }
        fields[STUDENT_TELEFON.fieldApiName] = this.studentTelefon;

        const recordInput = { apiName: STUDENT_OBJECT.objectApiName, fields};

        createRecord(recordInput)
            .then(student => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Student created',
                        message: 'Record ID: ' + student.id,
                        variant: 'success',
                    }),
                );
                this.resetValues();
            })
            .catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error creating record',
                        message: error.body.message,
                        variant: 'error',
                    }),
                );
            });
    }

    showPlacnik(event){
        console.log(event.target.value);
        let pickListValue = this.template.querySelector("[data-id='VrstaStudijaPickList']").value;
        this.visiblePlacnik = pickListValue === 'Izredni studij' ? true : false;
        this.studentVrstaStudija = event.target.value;
    }

    resetValues(){
        // edini lightning-input-field
        this.template.querySelector("[data-id='VrstaStudijaPickList']").reset();

        this.template.querySelectorAll('lightning-input').forEach(element => {
            if(element.type === 'checkbox'){
              element.checked = false;              
            }else{
              element.value = null;
            }      
        });
        this.visiblePlacnik = false;
    }

    handleSubmit(event){
        event.preventDefault();
        const emso = this.template.querySelector("[data-id='EMSO']");
        ValidateEmsoApex({ emso: emso.value })
            .then(results => {                
                if(results == null){
                    emso.setCustomValidity("Please provide EMSO as parameter.");
                }
                else if(results.success){
                    emso.setCustomValidity("");
                    this.createStudent();
                }
                else{
                    emso.setCustomValidity(results.message);
                }
            }
        );
        emso.reportValidity();        
    }

    validateEMSO(){
        const emso = this.template.querySelector("[data-id='EMSO']");
        ValidateEmsoApex({ emso: emso.value })
            .then(results => {                
                if(results == null){
                    emso.setCustomValidity("Please provide EMSO as parameter.");
                }
                else if(results.success){
                    emso.setCustomValidity("");
                }
                else{
                    emso.setCustomValidity(results.message);
                }
                emso.reportValidity();
            }
        );
    }

    handleEmsoChange(event){
        this.studentEmso = event.target.value;
    }

    handleImeChange(event){
        this.studentIme = event.target.value;
    }

    handlePriimekChange(event){
        this.studentPriimek = event.target.value;
    }

    handleEmailChange(event){
        this.studentEmail = event.target.value;
    }

    handleVrstaStudijaChange(event){
        this.studentVrstaStudija = event.target.value;
    }

    handleNaslovChange(event){
        this.studentNaslov = event.target.value;
    }

    handlePlacnikChange(event){
        this.studentPlacnik = event.detail.checked;
    }

    handleTelefonChange(event){
        this.studentTelefon = event.target.value;
    }

    handleDatumRojstvaChange(event){
        this.studentDatumRojstva = event.target.value;
    }
}