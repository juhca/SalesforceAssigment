public with sharing class EmsoValidationClass {

    @AuraEnabled
    public static Map<String,Object> getValidateEmsoApex(string emso){
        
        if(emso.length() == 0) return null;
        
        Http http = new Http();
        HttpRequest req = new HttpRequest();    

        req.setEndpoint('https://app.agilcon.com/job/emso.php?emso=' + emso);
        req.setMethod('GET');
        HttpResponse resp = http.send(req);

        if(resp.getStatusCode() == 200 || resp.getStatusCode() == 400) {
            // Deserialize the JSON string into collections of primitive data types.
            Map<String, Object> results = (Map<String, Object>) JSON.deserializeUntyped(resp.getBody());
            return results;
        }

        return null;
    }

    @AuraEnabled
    public static String getValidateEmsoOffline(string emso){
        if(emso == null || emso.length() == 0) return 'Please provide EMSO as parameter.';
        //     results.put('Please provide EMSO as parameter.', false);
        //     return results;
        // }

        if(emso.isNumeric() == false) return 'EMSO is invalid. EMSO must be numeric.';
        //     results.put('EMSO is invalid. EMSO must be numeric.', false);
        //     return results;
        // }

        if(emso.length() != 13) return 'EMSO is invalid. EMSO must be 13 numbers long.';
        //     results.put('EMSO is invalid. EMSO must be 13 numbers long.', false);
        //     return results;
        // }

        // Integer emsoSum = 0;
        // for(Integer i = 7; i > 1; i--){
        //     emsoSum += i * (Integer.valueOf(emso.charAt(7 - i)) + Integer.valueOf(emso.charAt(13 - i)));
        // }

        // Integer verificationCode = (math.mod(emsoSum, 11) == 0) ? 0 : (11 - (math.mod(emsoSum, 11)));


        Integer emsoSum = 0;
        for(Integer i = 7; i > 1; i--){
            Integer tmp1 = Integer.valueOf(emso.substring(7-i, 7-i+1));
            Integer tmp2 = Integer.valueOf(emso.substring(13-i, 13-i+1));
            emsoSum += i * (tmp1 + tmp2);
        }

        Integer verificationCode = (math.mod(emsoSum, 11) == 0) ? 0 : (11 - (math.mod(emsoSum, 11)));

        if(Integer.valueOf(emso.substring(12, 13)) == verificationCode){
            //results.put('OK.', true);
            return 'OK.';
        }
        else{
            return 'EMSO is invalid. Verification code is not correct.';
            //results.put('EMSO is invalid. Verification code is not correct.', false);
        }

        //return results;
    }
}