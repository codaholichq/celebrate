'use admin'
db.createUser({
  user: 'admin',
  pwd: 'frenda4real555',
  roles: [{
    role: 'root',
    db: 'admin'
  }]
})

'use rcnlagos'
db.createUser({
  user: 'rcnlagos',
  pwd: 'frenda4real555',
  roles: [{
    role: 'readWrite',
    db: 'rcnlagos'
  }]
})
