"use strict";

let createHash = require('sha.js');
let sha256 = createHash('sha256');
let _eventList = [];

let Event = function(title, description, date) {
  this.id = createEventHash(this);
  this.title = title;
  this.description = description;
  this.date = date;
};

let StatusMessage = function(statusCode, message, event) {
    this.status = statusCode;
    this.message = message || 'Operation finished';
    this.length = _eventList.length;
    if (event) this.event = event;
};

let createEventHash = event => sha256.update(event, 'utf8').digest('hex');

let deleteIdProperty = update => { if (update.hasOwnProperty('id')) delete update.id; };

let compareById = (event, id) => event.id === id;

let findAll = () => new Promise(resolve => resolve(_eventList));

let findById = id => new Promise((resolve, reject) => {
  let event = _eventList.find(event => compareById(event, id));
  if (event) resolve(event);
  else reject(new StatusMessage(404, 'Event not found'));
});

let findIndexById = id => {
  let index = _eventList.findIndex(event => compareById(event, id));
  if (index > -1) return index;
  else new StatusMessage(404, 'Event not found');
};

let add = event => new Promise(resolve => { 
  let newEvent = new Event(event.title,
                            event.description,
                            event.date);
  _eventList.push(newEvent);
  resolve(new StatusMessage(200, 'Event added!', newEvent));
  });

let updateById = (id, update) =>
  new Promise((resolve, reject) => {
    let index = findIndexById(id);
    if (index > -1) {
      deleteIdProperty(update);
      let event = Object.assign(_eventList[index], update);
      _eventList.splice(index, 1, event);
      resolve(new StatusMessage(200, 'Event updated!', event));
    }
    else reject(new StatusMessage(404, 'Event not found'));
});

let deleteById = id =>
  new Promise((resolve, reject) => {
    let index = findIndexById(id);
    if (index > -1) {
      let event = _eventList.splice(index, 1);
      resolve(new StatusMessage(200, 'Event deleted!', event[0]));
    } else reject(new StatusMessage(404, 'Event not found'));
});

add(new Event(
  "Concierto Metallica",
  "Evento Musical de calidad",
  "2017-04-09"));
add(new Event(
  "Concierto Red Hot Chilli Peppers",
  "Evento Musical de calidad maxima",
  "2017-04-10"));
add(new Event(
  "Concierto Maroon 5",
  "Evento Musical para ligar",
  "2017-04-11"));
add(new Event(
  "Concierto Rolling Stones",
  "Evento Musical de leyenda",
  "2017-04-12"));
add(new Event(
  "Concierto Mago de Oz",
  "Evento Musical de ponerse en pie y alzar el puño",
  "2017-04-13"));

module.exports = { findAll, findById, add, updateById, deleteById };