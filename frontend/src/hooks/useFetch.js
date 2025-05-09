import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for data fetching
 * @param {Function} fetchFunction - Function to fetch data
 * @param {Array} dependencies - Dependencies for useEffect
 * @returns {Object} - Loading state, error state, data, and refetch function
 */
const useFetch = (fetchFunction, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await fetchFunction();
      
      if (result.success === false) {
        setError(result.message || 'An error occurred');
        setData(null);
      } else {
        setData(result.data || result);
        setError(null);
      }
    } catch (err) {
      setError(err.message || 'An error occurred');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [fetchFunction]);

  useEffect(() => {
    fetchData();
  }, [...dependencies, fetchData]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch };
};

export default useFetch;
