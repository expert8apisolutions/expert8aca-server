import mongoose, {Document,Model,Schema} from "mongoose";


export interface IOrder extends Document{
    courseId: string;
    userId?:string;
    referenceNo?:string;
    payment_info: object;
    addressInfo?: IAddressInfo;
}

export interface IAddressInfo extends Document{
    fullname: string;
    phone:string;
    address:string;
}

const orderSchema = new Schema<IOrder>({
    courseId: {
     type: String,
     required: true
    },
    userId:{
        type: String,
        required: true
    },
    referenceNo:{
        type: String,
        required: true
    },
    payment_info:{
        type: Object,
        // required: true
    },
    addressInfo: {
        fullname: {type: String, },
        phone: {type: String, },
        address: {type: String, },
    }
},{timestamps: true});

const OrderModel: Model<IOrder> = mongoose.model('Order',orderSchema);

export default OrderModel;