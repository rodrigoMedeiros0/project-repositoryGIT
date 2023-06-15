import React, { useState, useEffect } from "react";
import { Container, Owner, Loading, Backbutton, IssuesList, PageActions, FilterList } from "./styles";
import {FaArrowLeft} from 'react-icons/fa';
import api from "../../services/api";
import { useParams } from "react-router-dom";
 
export default function Repositorio({ match }) {
  const [repositorio, setRepositorio] = useState({});
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const nomeRepoAux = useParams();
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState([
    {state: 'all', label: 'Todas', active: true},
    {state: 'open', label: 'Abertas', active: false},
    {state: 'closed', label: 'Fechadas', active: true},
  ]);

  const [filterIndex, setFilterIndex] = useState(0);

  useEffect(() => {
    async function load() {
      const nomeRepo = nomeRepoAux.repositorio;
 
      const [repositorioData, issuesData] = await Promise.all([
        api.get(`/repos/${nomeRepo}`),
        api.get(`/repos/${nomeRepo}/issues`, {
          params: {
            state: filters.find(f => f.active).state,
            per_page: 5,
          },
        }),
      ]);
 
      setRepositorio(repositorioData.data);
      setIssues(issuesData.data);
      setLoading(false);
    }
 
    load();
  }, [nomeRepoAux.repositorio]);


  useEffect(() => {
    async function loadIssue() {
      const nomeRepo = nomeRepoAux.repositorio;

      const response = await api.get(`/repos/${nomeRepo}/issues`, {
        params:{
          state:filters[filterIndex].state,
          page,
          per_page:5,
        }
      })

      setIssues(response.data)
    }

    loadIssue();
  }, [page, filterIndex, filters]);

  function handlePage(action) {
    setPage(action === 'back' ? page -1 : page + 1);
  }

  function handleFilter(index) {
    setFilterIndex(index);
  }

  if (loading) {
    return (
      <Loading>
        <h1>Carregando...</h1>
      </Loading>
    )
  }
 
  return(
    <Container>
      <Backbutton to="/">
        <FaArrowLeft  color="#000" size={35}/>
      </Backbutton>
      <Owner>
        <img src={repositorio.owner.avatar_url} alt={repositorio.owner.login} 
         />
         <h1>{repositorio.name}</h1>
         <p>{repositorio.description}</p>
      </Owner> 

      <FilterList active={filterIndex}>
        {filters.map((filter, index) => (
          <button
            type="button"
            key={filter.label}
            onClick={() => handleFilter(index)}
          >
            {filter.label}
          </button>
        ))}
      </FilterList>

      <IssuesList>
        {issues.map(issue =>(
          <li key={String(issue.id)}>
            <img src={issue.user.avatar_url} alt={issue.user.login}/>

            <div>
              <strong>
                <a href={issue.html_url}>{issue.title}</a>
                {issue.labels.map(label => (
                  <span key={String(label.id)}>{label.name}</span>
                ))}
              </strong>

              <p>{issue.user.login}</p>
            </div>
          </li>
        ))}
      </IssuesList>

      <PageActions>
        <button type="button" onClick={() => handlePage('back')} disabled={page < 2}>
          Voltar
        </button>
        <button type="button" onClick={() => handlePage('next')}>
          Proxima
        </button>
      </PageActions>

    </Container>
  )
}