const validator = {

  isEmail: function(email){
     if (/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email))
        return true;
     return false;
  },

  isPhone: function(phone){
     if(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/.test(phone))
        return true;
     return false;
  }

}

module.exports = validator;
