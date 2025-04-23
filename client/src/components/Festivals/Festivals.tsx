import React, { FC, Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { FestivalInterface, useStore } from '../../App';
import apiService from '../../api';

type FestivalsQueryResponse = {
  festivals: FestivalInterface[];
};

export const Festivals: FC = () => {
  const { highPrice, lowPrice } = useStore();

  const { data } = useQuery<any, any, { data: FestivalsQueryResponse }>({
    queryKey: ["festivals"],
    enabled: false,
    queryFn:
      async () =>
        await apiService.get<{ festivals: FestivalInterface[] }>(`/festivals?lowPrice=${lowPrice}&highPrice=${highPrice}`)
  })
  const navigate = useNavigate();
  return (
    <Fragment>
      <h1 className="display-1 bangers-regular" style={{ color: "black" }}>choose your festival</h1>
      <div className="d-flex flex-row justify-content-center align-items-center">
        {data?.data.festivals?.map((festival) => (
          <div
            key={festival.name}
            className="card text-center m-2"
            style={{
              width: "20rem",
              height: "22rem",
              backgroundColor: "rgba(31, 31, 61, 0.8)",
              color: "white",
              border: "none",
            }}>
            <div className="card-body">
              <h5 className="card-title bangers-regular">{festival.name}</h5>
              <p className="card-text">dates: {festival.startDate}-{festival.endDate}</p>
              <p className="card-text">location: {festival.location}</p>
              <a href={festival.website} className="btn btn-primary">Checkout {festival.name} website</a>
            </div>
            <button
              className="btn btn-success mt-2"
              onClick={() => navigate(`/festivals/package`)}>
            Choose
          </button>
          </div>
        ))}
    </div>
    </Fragment >
  );
};
