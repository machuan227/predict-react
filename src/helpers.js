import {CLASSIFICATION, NEXT_ACTIVITY, REGRESSION} from './reference';
import PropTypes from 'prop-types';

/**
 * Created by tonis.kasekamp on 10/9/17.
 */

export const sliceUuid = (uuid) => {
  return uuid.substring(0, 7);
};

export const jobPropType = PropTypes.shape({
  id: PropTypes.number.isRequired,
  status: PropTypes.string.isRequired,
  split: PropTypes.any.isRequired,
  type: PropTypes.oneOf([CLASSIFICATION, REGRESSION, NEXT_ACTIVITY]).isRequired,
  config: PropTypes.shape({
    prefix_length: PropTypes.number.isRequired,
    threshold: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    method: PropTypes.string.isRequired,
    clustering: PropTypes.string,
    encoding: PropTypes.string,
    rule: PropTypes.string
  }).isRequired,
  created_date: PropTypes.string.isRequired,
  modified_date: PropTypes.string.isRequired,
  result: PropTypes.shape({
    mae: PropTypes.number,
    rmse: PropTypes.number,
    rscore: PropTypes.number,
    fmeasure: PropTypes.number,
    acc: PropTypes.number,
    auc: PropTypes.number,
  }).isRequired
}).isRequired;

export const jobFlatPropType = PropTypes.shape({
  id: PropTypes.number.isRequired,
  status: PropTypes.string.isRequired,
  run: PropTypes.string.isRequired,
  splitName: PropTypes.string.isRequired,
  created_date: PropTypes.string.isRequired,
  modified_date: PropTypes.string.isRequired,
  prefix_length: PropTypes.number.isRequired,
  type: PropTypes.string.isRequired,
  rule: PropTypes.string,
  threshold: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
}).isRequired;

export const splitLabels = PropTypes.arrayOf(PropTypes.shape({
  value: PropTypes.number.isRequired,
  label: PropTypes.string.isRequired
}).isRequired).isRequired;