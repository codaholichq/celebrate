'use strict'
import { User } from '../models/index.js'
import { Crud } from './crud.js'

const read = new Crud(User).read
const create = new Crud(User).create
const remove = new Crud(User).remove
const update = new Crud(User).update

export const user = {
  read,
  create,
  update,
  remove
}
