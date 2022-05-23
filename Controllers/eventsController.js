const event = require("./../Models/eventModel");
// const mongoose = require("mongoose");
// const checkValidation = require("./../middle wares/checkValidation");
const checkValidation = require("../middle wares/checkValidationFn");


// CRUD operations
module.exports.getAllEvents = (request, response, next) => {
    event.find({})
        .then((data) => {
            response.status(200).json({ message: "get all events", data });
        })
        .catch(error => next(error));
}
module.exports.getEventByID = (request, response, next) => {
    checkValidation(request);
    event.find({ _id: request.params.id })
        .then((data) => {
            if (data.length > 0)
                response.status(200).json({ message: "get event by ID", data });
            else
                throw new Error("event doesnot exist");
        })
        .catch(error => next(error));
}
module.exports.addEvent = (request, response, next) => {
    console.log(request.body);
    checkValidation(request);
    let newEvent = new event({
        _id: request.body.id,
        title: request.body.title,
        date: request.body.date,
        mainSpeakerID: request.body.mainSpeakerID,
        otherSpeakersID: request.body.otherSpeakersID,
        students: request.body.students
    });
    newEvent.save()
        .then((data) => {
            response.status(201).json({ message: "speaker added", data });
        }).catch(error => next(error));
}
module.exports.updateEvent = (request, response, next) => {
    if (request.role != "admin")
        throw new Error("Not Authorized!");
    checkValidation(request);
    event.updateOne({ _id: request.body.id }, {
            $set: {
                _id: request.body.id,
                title: request.body.title,
                date: request.body.date,
                mainSpeakerID: request.body.mainSpeakerID,
                otherSpeakersID: request.body.otherSpeakersID,
                students: request.body.students
            }
        })
        .then(data => {
            if (data.matchedCount != 0)
                response.status(200).json({ message: "event updated", data });
            else
                throw new Error("event doesnot exist");
        }).catch(error => next(error));
}
module.exports.deleteEvent = (request, response, next) => {
    if (request.role != "admin")
        throw new Error("Not Authorized!");
    checkValidation(request);
    event.deleteOne({ _id: request.params.id })
        .then((data) => {
            if (data.deletedCount != 0)
                response.status(200).json({ message: "event deleted", data })
            else
                throw new Error("event doesnot exist");
        }).catch(error => next(error))
}