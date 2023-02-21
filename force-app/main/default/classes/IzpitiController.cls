public with sharing class IzpitiController {
  
    @AuraEnabled (cacheable=true)
    public static List<Predmet__c> getPredmeti(){
        return [SELECT Name, predmet_ime__c FROM Predmet__c];
    }

    @AuraEnabled
    public static List<IzpitniRok__c> getIzpitniRokiByPredmet(Integer predmetId){
        return [SELECT Name, datum__c, predmet_id__c FROM IzpitniRok__c WHERE predmet_id__c =: predmetId ORDER BY datum__c ASC];
    }

    @AuraEnabled 
    public static List<Izpit_Prijava__c> getPrijaveByIzpitniRok(Integer izpitniRokId){

         return [SELECT Name, izpitni_rok_ID__c, student_id__c FROM Izpit_Prijava__c WHERE izpitni_rok_ID__c =: izpitniRokId];
    }

    @AuraEnabled
    public static List<student__c> getStudentInfo(String studentId){
        return [SELECT student_ime__c, student_priimek__c FROM student__c WHERE Name =: studentId];
    }

    @AuraEnabled
    public static String deleteIzpitPrijava(String id){
        Izpit_Prijava__c[] deletePrijave = [SELECT Name FROM Izpit_Prijava__c WHERE Name =: id];

        try {
            delete deletePrijave;
            return 'OK';
        } catch (Exception e) {
            return e.getMessage();
            //throw new AuraHandledException(e.getMessage());
        }
    }
}