import { Schema, model } from "mongoose";

const subscriptionSchema = new Schema({
subscriber:{
    type: Schema.Types.ObjectId, // who is subscribing
    ref: "User",
},
channel: {
    type: Schema.Types.ObjectId, // whome to subscribing
    ref: "User"
}
},{timestamps: true})

export const Subscription = model("Subscription", subscriptionSchema)