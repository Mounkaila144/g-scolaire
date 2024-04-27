import React, { useState, useEffect } from 'react';
import { Select, InputBase } from '@mui/material';
import MyRequest from "../@core/components/request";
import {useDispatch, useSelector} from "react-redux";
import {selectPromotion} from "../store/promotion";

function PromotionSelector() {
  const [promotions, setPromotions] = useState([]);
  const [selectedPromotion, setSelectedPromotion] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const storedPromotion = useSelector(state => state.promotion.selectedPromotion);
  const dispatch = useDispatch();



  useEffect(() => {
    const fetchData = async () => {
      const response = await MyRequest('promotions', 'GET', [], {'Content-Type': 'application/json'});
      if (response.status === 200) {
        setSuccess(true);

        // Triez les promotions par ID de manière décroissante
        const sortedPromotions = response.data.data.sort((a, b) => b.id - a.id);
        setPromotions(sortedPromotions);

        // Si aucune promotion n'est stockée dans le localStorage, définissez celle avec le plus grand ID par défaut
        if (!storedPromotion && sortedPromotions.length > 0) {
          const defaultPromotion = sortedPromotions[0].id.toString();
          setSelectedPromotion(defaultPromotion);
          localStorage.setItem('selectedPromotion', defaultPromotion);
        } else if (storedPromotion) {
          setSelectedPromotion(storedPromotion);
        }
      } else {
        setError(true);
      }
    };

    fetchData();

    const handleStorageChange = (event) => {
      if (event.key === 'promotionUpdate') {
        fetchData();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);


  const handlePromotionChange = (e) => {
    const promotionId = e.target.value;
    dispatch(selectPromotion(promotionId));
    localStorage.setItem('selectedPromotion', promotionId);
  };

  return (
    <Select
      native
      input={<InputBase />}
      value={selectedPromotion}
      onChange={handlePromotionChange}
    >
      <option aria-label="None" value="" />
      {promotions.map(promotion => (
        <option key={promotion.id} value={promotion.id}>
     ({promotion.debut} - {promotion.fin})
        </option>
      ))}
    </Select>
  );
}

export default PromotionSelector;
