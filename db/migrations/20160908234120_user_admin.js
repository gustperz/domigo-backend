
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema
    .raw("INSERT INTO usuarios (username, password, email, rol) VALUES ('dmadmin', encrypt('1234'), 'viajaseguroapp@hotmail.com', 'SUPER_ADM');")
  ])
};

exports.down = function(knex, Promise) {  
  return Promise.all([
    
  ])
};

exports.config = {
  transaction: false
};
