'use strict'
import { clearKey } from '../data/cache.js'

export class Crud {
  constructor(model) {
    this.model = model
  }

  create = async (req, res) => {
    const collection = this.model(req.body)

    await this.model.findOne({ email: req.body.email }, (err, doc) => {
      if (doc) {
        res.json({
          message: 'Email already exist'
        })
      } else if (err) {
        res.send(err.message)
      } else {
        collection.save((err, doc) => {
          if (err) {
            return console.error(err)
          }
          res.json({
            message: 'Data was added successfully!'
          })
        })
        clearKey(this.model.collection.collectionName)
      }
    })
  }

  read = async (req, res) => {
    let doc = {}
    const id = req.params.id

    let { page, limit, cell } = req.query
    page = parseInt(page)
    limit = parseInt(limit)
    cell = (cell == '') ? '' : cell

    const totalWithCell = await this.model.countDocuments({ cell })
    const totalWithoutCell = await this.model.estimatedDocumentCount()
    const total = (totalWithCell <= 0) ? totalWithoutCell : totalWithCell
    console.log(total)

    const startIndex = (page - 1) * limit
    const endIndex = page * limit

    const prevPage = (startIndex > 0) ? page - 1 : ''
    const nextPage = (endIndex < total) ? page + 1 : ''

    const pager = {
      nextPage,
      prevPage,
      currentPage: page,
      totalPage: Math.ceil(total / limit)
    }

    if (id) {
      doc = await this.model.find({ _id: id })//.cache({ time: 600 })

    } else if (cell == '') {

      doc = await this.model
        .find()
        .limit(limit)
        .skip(startIndex)
        .sort({ _id: 'desc' })
      // .cache({ time: 600 })
    } else {

      doc = await this.model
        .find()
        .where({ cell })
        .limit(limit)
        .skip(startIndex)
        .sort({ _id: 'desc' })
      // .cache({ time: 600 })
    }
    res.send({ ...pager, doc })
  }

  remove = async (req, res, next) => {
    await this.model.findByIdAndRemove(req.params.id, (err, doc) => {
      if (err) return next(err)
      clearKey(this.model.collection.collectionName)
      res.send(doc.firstname + ' ' + doc.lastname + ' was deleted successfully!');
    })
  }

  update = async (req, res, next) => {
    await this.model.findByIdAndUpdate(
      req.params.id, {
      $set: req.body
    },
      (err, doc) => {
        if (err) return next(err)
        clearKey(this.model.collection.collectionName)
        res.send('Birthday udpated.')
      }
    )
  }
}
