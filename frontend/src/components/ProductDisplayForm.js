import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Success from './Success.js';
import axios from 'axios';

var data={};
class ProductDisplayForm extends React.Component {
	constructor(props){
		super(props);
		this.state={
			step:1,
			errors:{},
			accounts:[],
			products:[],
			errormsg:'',
			activeItem:{
				product_image:'',
				product_name:'',
				product_price:'',
				pub_date:'',
				product_author:'',
			},
			editing:false,

		};
		this.handleChange=this.handleChange.bind(this)
		this.handleSubmit=this.handleSubmit.bind(this)
		this.handleImageChange=this.handleImageChange.bind(this)
	}

	nextStep=()=>{
		const{step}=this.state;
		this.setState({
			step:step+1
		});
	}
	async componentDidMount(){
		await fetch(`${process.env.REACT_APP_API_URL}/accounts/accounts-list`)
			.then(res => res.json())
			.then(data => {
				this.setState({
					accounts:data,
				});
			})

			.catch(err => console.log(err, 'error...'))
	}
	handleChange= name => e => {
		data[name]=e.target.value
		console.log(data)
		this.setState({
			activeItem:data
		});
	}
	handleImageChange= name => e => {
		data[name]=e.target.files[0]
		console.log(data)
		this.setState({
			activeItem:data
		});

	}
	handleSubmit = e => {
		e.preventDefault()
		if (this.validation()){
		let form_data = new FormData();
		    form_data.append('product_image', this.state.activeItem.product_image, this.state.activeItem.product_image.name);
		    form_data.append('product_name', this.state.activeItem.product_name)
		    form_data.append('product_price', this.state.activeItem.product_price)
		    form_data.append('pub_date', this.state.activeItem.pub_date)
		    form_data.append('product_author', this.state.activeItem.product_author)

		    let url = `${process.env.REACT_APP_API_URL}/products/add-product`
		    axios.post(url, form_data, {
		      headers: {
			'content-type': 'multipart/form-data',
			'Authorization':`JWT ${localStorage.getItem('access')}`,
			'Accept':'application/json'
		      }
		    })
		.catch(err=>
		this.setState({
			errormsg:err.response.data.detail
		})
		);
		this.nextStep();
		}
	}
	  validation=()=>{
	      let activeItem= this.state.activeItem;
	      let errors = {};
	      let isValid = true;
	  
	  
	      if (!activeItem["product_image"]) {
		isValid = false;
		errors["product_image"] = "Please upload an image.";
	      }
	      if (!activeItem["product_name"]) {
		isValid = false;
		errors["product_name"] = "Please enter the Product Name.";
	      }
	      if (!activeItem["product_price"]) {
		isValid = false;
		errors["product_price"] = "Please enter the Product Price";
	      }
	      if (!activeItem["pub_date"]) {
		isValid = false;
		errors["pub_date"] = "Please enter the publish date.";
	      }
	      if (!activeItem["product_author"]) {
		isValid = false;
		errors["product_author"] = "Please enter the Product Author.";
	      }
	  
	  
	      this.setState({
		errors: errors
	      });
	  
	      return isValid;
	  }

	render(){
		const{accounts}=this.state;
		const {step}=this.state;
		switch (step) {
			case 1:
				return (
					<Grid
					container
					spacing={0}
					direction="column"
					alignItems="center"
					justifyContent="center"
					style={{ minHeight: '100vh' }}
					>
					<Box
					component="form"
					sx={{
						'& .MuiTextField-root': { m: 1, width: '25ch' },
					}}
					noValidate
					autoComplete="off"
					>
					<div>
					<TextField
					required
					type="file"
					id="product_image"
					label="Product Image"
					onChange={this.handleImageChange("product_image")}
					InputLabelProps={{
						shrink: true,
					}}
					/>
					</div>
					<div>{this.state.errors.product_image}</div>
					<div>
					<TextField
					required
					id="product_name"
					label="Product Name"
					onChange={this.handleChange("product_name")}
					defaultValue={this.state.activeItem.product_name}
					/>
					</div>

					<div>{this.state.errors.product_name}</div>
					<div>
					<TextField
					required
					id="product_price"
					type="number"
					onChange={this.handleChange("product_price")}
					defaultValue={this.state.activeItem.product_price}
					label="Product Price"
					/>
					</div>
					<div>{this.state.errors.product_pric}</div>
					<div>
					<TextField
					required
					id="pub_date"
					type="date"
					onChange={this.handleChange("pub_date")}
					defaultValue={this.state.activeItem.pub_date}
					label="Published Date"
					InputLabelProps={{
						shrink: true,
					}}
					/>
					</div>
					<div>{this.state.errors.pub_date}</div>
					<div>
					<TextField
					required
					select
					id="product_author"
					label="Product Author"
					defaultValue={this.accounts||''}
					onChange={this.handleChange("product_author")}
					>
					{accounts.map((option) => (
						<MenuItem key={option.email} value={option.id}>
						{option.email}
						</MenuItem>
					))}
					</TextField>
					</div>
					<div>{this.state.errors.product_author}</div>
					<div>
					<Button onClick={this.handleSubmit} variant="contained">Submit</Button>
					</div>
					</Box>
					</Grid>
				);
			case 2:
				return (<Success message={this.state.errormsg} />);
		}
	}
}
export default ProductDisplayForm;

