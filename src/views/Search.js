import React, {useState, useEffect} from "react";
import {
    Container,
    Row,
    Col,
    Image,
    Form, 
    FormControl, 
    Button,
    Navbar,
    Card
} from "react-bootstrap";

import axios from 'axios';

import GithubLogo from "../static/github-logo.png";
import NpmJsLogo from "../static/npmjs.png";
import styled, { keyframes } from 'styled-components';

export const SearchPage = () =>{

    const [showResultsPage, setShowResultsPage] = useState(false);

    const [userQuery, setUserQuery] = useState("");

    const [modulesInfo, setModulesInfo] = useState([]);

    const [showResults, setShowResults] = useState(false);

    const [isLoading, setIsLoading] = useState(false);

    const SearchBar = ({customStyle}) => {

        const [query, setQuery] = useState(userQuery);

        const getModuleInfo = () => {
            setIsLoading(true)
            axios.get('http://localhost:8000/moduleHunter/search',{
                params: {
                    query: query
                }
            })
            .then((modulesData)=>{
                const data = JSON.parse(modulesData.data);
                setModulesInfo(data);
                setIsLoading(false);
                setShowResults(true);
            })
            .catch(error => console.error(error));
        }
        

        const handleSearch = () => {
            if(!showResultsPage){
                setShowResultsPage(true);
            } 
            setUserQuery(query);
            getModuleInfo();
        }

        return (
          <div className="d-flex justify-content-center">
            <Form className="d-flex justify-content-center align-items-center">
              <FormControl
                rounded
                type="text"
                placeholder="Search"
                className="mr-sm-2"
                style={customStyle}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <Button onClick={handleSearch} variant="outline-primary" className="mx-2" style={{border: 'none',  backgroundColor: '#000000', color: '#ffffff'}}>
                Search
              </Button>
            </Form>
          </div>
        );
    };

    const ModuleCard = ({module}) => {
        return (
            <div>
                <Row className="py-3">
                    <Col className="my-auto" xs={4}>
                        <Row>
                            <Col>
                                <h5 style={{fontFamily: 'Source Sans Pro, Lucida Grande, sans-serif', fontSize: '1rem', fontWeight: '700', textAlign: 'left'}}>{module.name}</h5>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <p className="my-auto py-auto" style={{fontFamily: 'Source Sans Pro, Lucida Grande, sans-serif', fontSize: '0.8rem', fontWeight: '500', textAlign: 'left', color: '#606060'}}>Published {module.version}&nbsp;&nbsp;&nbsp;&nbsp;&bull;&nbsp;&nbsp;&nbsp;&nbsp;{module.last_publish}</p>
                            </Col>
                        </Row>
                    </Col>
                    <Col xs={2}>
                        <a href={"https://"+ module.homepage}>
                            <Image style={{height: '50px', width: '50px'}} fluid src={GithubLogo} />
                        </a>
                    </Col>
                    <Col xs={2}>
                        <a href={module.url}>
                            <Image style={{height: '50px', width: '50px'}} fluid src={NpmJsLogo} />
                        </a>
                    </Col>
                    <Col xs={4} className="my-auto">
                        <p className="d-flex justify-content-center align-items-center my-auto py-auto" style={{fontFamily: 'Source Sans Pro, Lucida Grande, sans-serif', fontWeight: '500', fontSize: '0.8rem', textAlign: 'left', color: '#606060'}}><strong style={{color: 'black', fontSize: '2rem'}}>{module.weekly_downloads}</strong> &nbsp; Weekly Downloads</p>
                    </Col>
                </Row>
                <hr></hr>
            </div>
        );
    }

    const Results = () =>{
        return (
            <Container fluid>
                <Row>
                    <Col className="py-3">
                        {modulesInfo.map((module) => (
                            <ModuleCard key={module.doc_id} module={module}/>
                        ))}
                    </Col>
                </Row>
            </Container>
        );
    } 

    const NoResults= () =>{
        return (
            <Row className="h-100">
                <Col className="d-flex justify-content-center align-items-center">
                    <h1 style={{color: 'gray', fontSize: '1rem'}}>No Results Found</h1>
                </Col>
            </Row>
        );
    }

    const Search = () => {
        const style={
            width: "400px",
        }
        return (
            <Row className="h-100">
                <Col className="d-flex justify-content-center align-items-center flex-column">
                    <Row>
                        <Col className="d-block">
                            <h2 style={{fontSize: '3rem', color: 'black', fontWeight: '900'}}>MODULE HUNTER</h2>
                        </Col>
                    </Row>
                    <Row className="mt-2">
                        <Col className="d-block">
                            <SearchBar customStyle={style}/>
                        </Col>
                    </Row>
                </Col>
            </Row>
        );
    }

    const LoadingSpinner = () => {
        const spin = keyframes`
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        `;

        const Spinner = styled.div`
            width: 50px;
            height: 50px;
            border: 5px solid #f3f3f3;
            border-top: 5px solid #383636;
            border-radius: 50%;
            animation: ${spin} 1.5s linear infinite;
        `;

        return (
            <div className="h-100 d-flex justify-content-center align-items-center spinner-container">
                <Spinner />
            </div>
        );
    }

    const SearchResults = () => {
        const style={
            width: "400px"
        }

        return(
            <>
                <Navbar bg="light" expand="lg">
                    <Container fluid>
                        <Navbar.Brand href="#"><h2 style={{color: 'black', fontWeight: '900'}}>MODULE HUNTER</h2></Navbar.Brand>
                        <SearchBar customStyle={style}/>
                    </Container>
                </Navbar>
                {showResults && modulesInfo && modulesInfo.length > 0 ? (isLoading ? <LoadingSpinner/> : <Results/>) : (isLoading ? <LoadingSpinner/> : <NoResults/>)}
            </>
        );
    }

    return(
        <Container fluid style={{height: '100vh'}}>
            { showResultsPage ? (isLoading ? <LoadingSpinner/> : <SearchResults/>) : (isLoading ? <LoadingSpinner/> : <Search/>) }
        </Container>
    );
}