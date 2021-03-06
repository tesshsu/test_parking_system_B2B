
//Importation du modele 
const Parking = require('../models/parking');
const User = require('../models/user');

//Importation file system
const fs = require('fs');

//Création d'une parking
exports.createParking = (req, res, next) => {
  try {
    const parkingObject = req.body;
    delete parkingObject._id;
    const parking = new Parking({
      ...parkingObject,
    });
    parking
      .save()
      .then(() => res.status(201).json({ message: "parking enregistrée" }))
      .catch((error) => res.status(400).json({ error }));
  } catch (err) {
    console.log('Error: ', err.message);
  }
};

//Modification d'une Parking
exports.updateParking = (req, res, next) => {
  const parkingObject = req.body;
  Parking.updateOne(
    { _id : req.params.id}, 
    {...parkingObject, _id: req.params.id}
    )
  .then(res.status(200).json({ message : "Parking modifiée"}))
  .catch(error => res.status(400).json({ error }));
};

//Suppression d'une parking
exports.deleteParking = (req, res, next) => {
  Parking.findOne({ _id: req.params.id })
    .then(parking => {
      Parking.deleteOne({ _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Parking supprimée !'}))
        .catch(error => res.status(400).json({ error }));
  })
    .catch(error => res.status(500).json({ error }));
};

//Affichage des parkings et filter par floor
exports.getAllParkings = (req, res, next) => {

  let filter = {};
  if(req.query.floor){
      filter['floor'] = req.query.floor;
      filter['availability'] = true;
  }

  Parking.find(filter).sort({ field: 'asc', test: -1 })
    .then(parkings => res.status(200).json(parkings))
    .catch(error => res.status(400).json({ error }));
};

//Affichage d'une parking
exports.getOneParking = (req, res, next) => {
  Parking.findOne({ _id: req.params.id })
    .then(parking => res.status(200).json(parking))
    .catch(error => res.status(404).json({ error }));
};

//Assigner une place de parking à un user
exports.assginParkingtoUser = async (req, res, next) => {
  let userId = req.body.userId
  let parkingId = req.params.id

  const parkingData = await Parking.create({
    content: req.body.content,
    assignUser: userId,
  });

  await Parking.updateOne({ _id: parkingId }, { $push: { parking: parkingData._id }})
  .then(() => res.status(200).json({ message: `Assigner une place` }))
  .catch((error) => res.status(400).json({ error }))

};