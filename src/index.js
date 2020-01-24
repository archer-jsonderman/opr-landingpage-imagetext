import React from "react"
import PropTypes from "prop-types"
import ReactDOM from "react-dom"
import { init } from "contentful-ui-extensions-sdk"
import update from 'immutability-helper';
import Uploader from "./components/imageUploader"
import Content from "./components/content"
import "./index.scss"

//load stateless components to make up the Hero Area Manager.
//this version includes headline, icon repeater, and bg image picker
//TODO: add preview option in dialog
const initialData = {
	isDraggingOver: false,
		content:'',
		image:{}	
}
class App extends React.Component {
  static propTypes = {
    sdk: PropTypes.object.isRequired
  }
constructor(props){
	super(props)
	if(!this.props.sdk.field.getValue()){
		this.state = initialData
	}else{
		this.state=this.props.sdk.field.getValue()
	}
}
  

  componentDidMount() {
    this.props.sdk.window.startAutoResizer()
	// Handler for external field value changes (e.g. when multiple authors are working on the same entry).
    //this.detachExternalChangeHandler = this.props.sdk.field.onValueChanged(this.onExternalChange)

  }
  componentWillUnmount() {
	  //need to add this or onExternal Change will keep nesting value objects in state
    //this.detachExternalChangeHandler()
  }
  
   handleStateChange =(target,newState)=>{
	   const updatedState = update(
		   this.state,{
			   [target]:{$set:newState}
		   }
	   )	  
	   this.setState(updatedState,this.saveValues)
	   
   }
  saveValues=()=>{
	  //console.log(this.state,' saving')
	  this.props.sdk.field.setValue(this.state)
  }
   onExternalChange = value => {
    //this.setState({ value })
  }
 
  render = () => {
      return ( 
	      <>
		    <Content 
		    	title='Content'
		    	onStateChange={this.handleStateChange}
		    	{...this.state}/>
		  	<Uploader 
		  		title='Image'
		  		sdk={this.props.sdk} 
		  		onStateChange={this.handleStateChange}
		  		{...this.state} />

		  	</>
  		)
  }
}

init(sdk => {
  ReactDOM.render(<App sdk={sdk} />, document.getElementById("root"))
})

if (module.hot) {
  module.hot.accept()
}
