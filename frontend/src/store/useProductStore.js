import {create} from 'zustand';
import axios from 'axios';

const BASE_URL = "http://localhost:3000";

export const useProductStore = create((set) => ({
    products:[],
    loading: false,
    error:null,
    fetchProducts: async () => {
        set({loading: true});
        try{
            const response = await axios.get(`${BASE_URL}/api/products`);
            set({products: response.data.data, error:null});

        }catch(err) {
            if(err.status == 429) set({error: "rate limit exceeded"});
            else set({error: "something went wrong"});
        }finally{
            set({loading:false});
        }
    }


}));