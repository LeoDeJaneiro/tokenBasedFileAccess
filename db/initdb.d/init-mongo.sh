set -e

mongo -- "$MONGO_INITDB_DATABASE" <<EOF
  var accessDB = db.getSiblingDB('access')
  accessDB.createUser({
    user: '$API_INTERNAL_USERNAME',
    pwd: '$API_INTERNAL_PASSWORD',
    roles: [{
      role: 'readWrite',
      db: 'access'
    }]
  })
EOF