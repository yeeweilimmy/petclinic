const chai = require('chai');
const chaiHttp = require('chai-http');
const http = require('http');
const app = require('../server');
const connectDB = require('../config/db');
const mongoose = require('mongoose');
const sinon = require('sinon');
const Appointment = require('../models/Appointment');
const { updateAppointment, getAppointments, addAppointment, deleteAppointment } = require('../controllers/appointmentController');
const { expect } = chai;

chai.use(chaiHttp);
let server;
let port;


// --------------------------
// Add Appointment Tests
// --------------------------

describe('AddAppointment Function Test', () => {

  it('should create a new appointment successfully', async () => {
    const req = {
      user: { id: new mongoose.Types.ObjectId() },
      body: {
        title: "New Appointment",
        description: "Appointment description",
        deadline: "2025-12-31",
        petId: null,
        petName: null,
        petAge: null,
        petBreed: null
      }
    };

    const createdAppointment = {
      _id: new mongoose.Types.ObjectId(),
      userId: req.user.id,
      ...req.body,
      populate: sinon.stub().resolvesThis()
    };

    const createStub = sinon.stub(Appointment, 'create').resolves(createdAppointment);

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    await addAppointment(req, res);

    expect(createStub.calledOnceWith({ userId: req.user.id, ...req.body })).to.be.true;
    expect(createdAppointment.populate.calledWith('petId', 'firstName lastName age breed')).to.be.true;
    expect(res.status.calledWith(201)).to.be.true;
    expect(res.json.calledWith(createdAppointment)).to.be.true;

    createStub.restore();
  });

  it('should return 500 if an error occurs', async () => {
    const createStub = sinon.stub(Appointment, 'create').throws(new Error('DB Error'));

    const req = {
      user: { id: new mongoose.Types.ObjectId() },
      body: {
        title: "New Appointment",
        description: "Appointment description",
        deadline: "2025-12-31"
      }
    };

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    await addAppointment(req, res);

    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;

    createStub.restore();
  });

});


// --------------------------
// Update Appointment Tests
// --------------------------

describe('UpdateAppointment Function Test', () => {

  it('should update appointment successfully', async () => {
    const appointmentId = new mongoose.Types.ObjectId();
    const existingAppointment = {
      _id: appointmentId,
      title: "Old Appointment",
      description: "Old Description",
      completed: false,
      deadline: new Date(),
      save: sinon.stub().resolvesThis(),
      populate: sinon.stub().resolvesThis()
    };

    const findByIdStub = sinon.stub(Appointment, 'findById').resolves(existingAppointment);

    const req = { params: { id: appointmentId }, body: { title: "Updated Appointment", completed: true } };
    const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

    await updateAppointment(req, res);

    expect(existingAppointment.title).to.equal("Updated Appointment");
    expect(existingAppointment.completed).to.equal(true);
    expect(existingAppointment.save.calledOnce).to.be.true;
    expect(existingAppointment.populate.calledWith('petId', 'firstName lastName age breed')).to.be.true;
    expect(res.json.calledWith(existingAppointment)).to.be.true;

    findByIdStub.restore();
  });

  it('should return 404 if appointment not found', async () => {
    const findByIdStub = sinon.stub(Appointment, 'findById').resolves(null);

    const req = { params: { id: new mongoose.Types.ObjectId() }, body: {} };
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

    await updateAppointment(req, res);

    expect(res.status.calledWith(404)).to.be.true;
    expect(res.json.calledWith({ message: 'Appointment not found' })).to.be.true;

    findByIdStub.restore();
  });

  it('should return 500 on error', async () => {
    const findByIdStub = sinon.stub(Appointment, 'findById').throws(new Error('DB Error'));

    const req = { params: { id: new mongoose.Types.ObjectId() }, body: {} };
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

    await updateAppointment(req, res);

    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;

    findByIdStub.restore();
  });

});


// --------------------------
// Get Appointments Tests
// --------------------------

describe('GetAppointments Function Test', () => {

  it('should return appointments for the given user', async () => {
    const userId = new mongoose.Types.ObjectId();
    const appointments = [
      { _id: new mongoose.Types.ObjectId(), title: "Appointment 1", userId },
      { _id: new mongoose.Types.ObjectId(), title: "Appointment 2", userId }
    ];

    const findStub = sinon.stub(Appointment, 'find').returns({
      populate: sinon.stub().resolves(appointments)
    });

    const req = { user: { id: userId } };
    const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

    await getAppointments(req, res);

    expect(findStub.calledOnceWith({ userId })).to.be.true;
    expect(res.json.calledWith(appointments)).to.be.true;
    expect(res.status.called).to.be.false;

    findStub.restore();
  });

  it('should return 500 on error', async () => {
    const findStub = sinon.stub(Appointment, 'find').throws(new Error('DB Error'));

    const req = { user: { id: new mongoose.Types.ObjectId() } };
    const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

    await getAppointments(req, res);

    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;

    findStub.restore();
  });

});


// --------------------------
// Delete Appointment Tests
// --------------------------

describe('DeleteAppointment Function Test', () => {

  it('should delete an appointment successfully', async () => {
    const req = { params: { id: new mongoose.Types.ObjectId().toString() } };
    const appointment = { deleteOne: sinon.stub().resolves() };

    const findByIdStub = sinon.stub(Appointment, 'findById').resolves(appointment);

    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

    await deleteAppointment(req, res);

    expect(findByIdStub.calledOnceWith(req.params.id)).to.be.true;
    expect(appointment.deleteOne.calledOnce).to.be.true;
    expect(res.json.calledWith({ message: 'Appointment deleted' })).to.be.true;

    findByIdStub.restore();
  });

  it('should return 404 if appointment not found', async () => {
    const findByIdStub = sinon.stub(Appointment, 'findById').resolves(null);

    const req = { params: { id: new mongoose.Types.ObjectId().toString() } };
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

    await deleteAppointment(req, res);

    expect(findByIdStub.calledOnceWith(req.params.id)).to.be.true;
    expect(res.status.calledWith(404)).to.be.true;
    expect(res.json.calledWith({ message: 'Appointment not found' })).to.be.true;

    findByIdStub.restore();
  });

  it('should return 500 if an error occurs', async () => {
    const findByIdStub = sinon.stub(Appointment, 'findById').throws(new Error('DB Error'));

    const req = { params: { id: new mongoose.Types.ObjectId().toString() } };
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

    await deleteAppointment(req, res);

    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;

    findByIdStub.restore();
  });

});

