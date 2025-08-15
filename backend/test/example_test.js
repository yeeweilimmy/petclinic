
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

//test


describe('AddAppointment Function Test', () => {

  it('should create a new appointment successfully', async () => {
    // Mock request data
    const req = {
      user: { id: new mongoose.Types.ObjectId() },
      body: { title: "New Appointment", description: "Appointment description", deadline: "2025-12-31" }
    };

    // Mock appointment that would be created
    const createdAppointment = { _id: new mongoose.Types.ObjectId(), ...req.body, userId: req.user.id };

    // Stub Appointment.create to return the createdAppointment
    const createStub = sinon.stub(Appointment, 'create').resolves(createdAppointment);

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await addAppointment(req, res);

    // Assertions
    expect(createStub.calledOnceWith({ userId: req.user.id, ...req.body })).to.be.true;
    expect(res.status.calledWith(201)).to.be.true;
    expect(res.json.calledWith(createdAppointment)).to.be.true;

    // Restore stubbed methods
    createStub.restore();
  });

  it('should return 500 if an error occurs', async () => {
    // Stub Appointment.create to throw an error
    const createStub = sinon.stub(Appointment, 'create').throws(new Error('DB Error'));

    // Mock request data
    const req = {
      user: { id: new mongoose.Types.ObjectId() },
      body: { title: "New Appointment", description: "Appointment description", deadline: "2025-12-31" }
    };

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await addAppointment(req, res);

    // Assertions
    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;

    // Restore stubbed methods
    createStub.restore();
  });

});


describe('Update Function Test', () => {

  it('should update appointment successfully', async () => {
    // Mock appointment data
    const appointmentId = new mongoose.Types.ObjectId();
    const existingAppointment = {
      _id: appointmentId,
      title: "Old Appointment",
      description: "Old Description",
      completed: false,
      deadline: new Date(),
      save: sinon.stub().resolvesThis(), // Mock save method
    };
    // Stub Appointment.findById to return mock appointment
    const findByIdStub = sinon.stub(Appointment, 'findById').resolves(existingAppointment);

    // Mock request & response
    const req = {
      params: { id: appointmentId },
      body: { title: "New Appointment", completed: true }
    };
    const res = {
      json: sinon.spy(),
      status: sinon.stub().returnsThis()
    };

    // Call function
    await updateAppointment(req, res);

    // Assertions
    expect(existingAppointment.title).to.equal("New Appointment");
    expect(existingAppointment.completed).to.equal(true);
    expect(res.status.called).to.be.false; // No error status should be set
    expect(res.json.calledOnce).to.be.true;

    // Restore stubbed methods
    findByIdStub.restore();
  });



  it('should return 404 if appointment is not found', async () => {
    const findByIdStub = sinon.stub(Appointment, 'findById').resolves(null);

    const req = { params: { id: new mongoose.Types.ObjectId() }, body: {} };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    await updateAppointment(req, res);

    expect(res.status.calledWith(404)).to.be.true;
    expect(res.json.calledWith({ message: 'Appointment not found' })).to.be.true;

    findByIdStub.restore();
  });

  it('should return 500 on error', async () => {
    const findByIdStub = sinon.stub(Appointment, 'findById').throws(new Error('DB Error'));

    const req = { params: { id: new mongoose.Types.ObjectId() }, body: {} };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    await updateAppointment(req, res);

    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.called).to.be.true;

    findByIdStub.restore();
  });



});



describe('GetAppointment Function Test', () => {

  it('should return appointments for the given user', async () => {
    // Mock user ID
    const userId = new mongoose.Types.ObjectId();

    // Mock appointment data
    const appointments = [
      { _id: new mongoose.Types.ObjectId(), title: "Appointment 1", userId },
      { _id: new mongoose.Types.ObjectId(), title: "Appointment 2", userId }
    ];

    // Stub Appointment.find to return mock appointments
    const findStub = sinon.stub(Appointment, 'find').resolves(appointments);

    // Mock request & response
    const req = { user: { id: userId } };
    const res = {
      json: sinon.spy(),
      status: sinon.stub().returnsThis()
    };

    // Call function
    await getAppointments(req, res);

    // Assertions
    expect(findStub.calledOnceWith({ userId })).to.be.true;
    expect(res.json.calledWith(appointments)).to.be.true;
    expect(res.status.called).to.be.false; // No error status should be set

    // Restore stubbed methods
    findStub.restore();
  });

  it('should return 500 on error', async () => {
    // Stub Appointment.find to throw an error
    const findStub = sinon.stub(Appointment, 'find').throws(new Error('DB Error'));

    // Mock request & response
    const req = { user: { id: new mongoose.Types.ObjectId() } };
    const res = {
      json: sinon.spy(),
      status: sinon.stub().returnsThis()
    };

    // Call function
    await getAppointments(req, res);

    // Assertions
    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;

    // Restore stubbed methods
    findStub.restore();
  });

});



describe('DeleteAppointment Function Test', () => {

  it('should delete a appointment successfully', async () => {
    // Mock request data
    const req = { params: { id: new mongoose.Types.ObjectId().toString() } };

    // Mock appointment found in the database
    const appointment = { remove: sinon.stub().resolves() };

    // Stub Appointment.findById to return the mock appointment
    const findByIdStub = sinon.stub(Appointment, 'findById').resolves(appointment);

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await deleteAppointment(req, res);

    // Assertions
    expect(findByIdStub.calledOnceWith(req.params.id)).to.be.true;
    expect(appointment.remove.calledOnce).to.be.true;
    expect(res.json.calledWith({ message: 'Appointment deleted' })).to.be.true;

    // Restore stubbed methods
    findByIdStub.restore();
  });

  it('should return 404 if appointment is not found', async () => {
    // Stub Appointment.findById to return null
    const findByIdStub = sinon.stub(Appointment, 'findById').resolves(null);

    // Mock request data
    const req = { params: { id: new mongoose.Types.ObjectId().toString() } };

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await deleteAppointment(req, res);

    // Assertions
    expect(findByIdStub.calledOnceWith(req.params.id)).to.be.true;
    expect(res.status.calledWith(404)).to.be.true;
    expect(res.json.calledWith({ message: 'Appointment not found' })).to.be.true;

    // Restore stubbed methods
    findByIdStub.restore();
  });

  it('should return 500 if an error occurs', async () => {
    // Stub Appointment.findById to throw an error
    const findByIdStub = sinon.stub(Appointment, 'findById').throws(new Error('DB Error'));

    // Mock request data
    const req = { params: { id: new mongoose.Types.ObjectId().toString() } };

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await deleteAppointment(req, res);

    // Assertions
    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;

    // Restore stubbed methods
    findByIdStub.restore();
  });

});