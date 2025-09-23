import { model, models, Schema } from "mongoose";


const addresseSchema = new Schema({
    userId: {},
    fullName: {},
    phoneNumber: {},
    pincode: {},
    area: {},
    city: {},
    state: {}
})

const Addresses = models.address || model("address",addresseSchema);

export default Addresses;