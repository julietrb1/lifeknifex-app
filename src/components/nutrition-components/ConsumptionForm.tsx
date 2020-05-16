import React, { SyntheticEvent, useCallback, useEffect, useRef, useState, } from 'react';
import axios, { CancelTokenSource } from 'axios';
import moment from 'moment';
import {
  Button,
  CheckboxProps,
  Confirm,
  Divider,
  Dropdown,
  DropdownProps,
  Form,
  Input,
  Radio,
  Search,
  SearchProps,
  SearchResultProps,
} from 'semantic-ui-react';
import './ConsumptionForm.scss';
import { useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import { TIME_FORMAT_STRING } from '../../constants';
import { selectFoodsLoading } from '../../features/foods/foodSelectors';
import {
  selectConsumptionById,
  selectConsumptionLoadedById,
  selectConsumptionsLoading,
} from '../../features/consumptions/consumptionSelectors';
import { RootState } from '../../redux/rootReducer';
import IFood from '../../models/IFood';
import {
  createConsumption,
  deleteConsumption,
  fetchConsumption,
  updateConsumption,
} from '../../features/consumptions/consumptionSlice';
import HeaderBar from '../common-components/HeaderBar';
import BreadcrumbSet from '../common-components/BreadcrumbSet';
import { extractError, healthStrings, useDebounce } from '../../Utils';
import { reqGetAllFoods } from '../../backend';

interface IConsumptionFormMatchParams {
  consumptionId?: string;
}

const generateHours = () => {
  const hours = [];
  for (let i = 0; i < moment().get('hour') + 1; i += 1) {
    const dateForTime = moment()
      .set('hour', i)
      .set('minute', 0)
      .set('second', 0)
      .set('millisecond', 0);
    hours.push({
      text: dateForTime.format(TIME_FORMAT_STRING),
      value: dateForTime.format(),
      key: i,
    });
  }

  return hours;
};

const quantities = [
  { text: 'Small', value: 1 },
  { text: 'Medium', value: 2 },
  { text: 'Large', value: 3 },
  { text: 'Extra Large', value: 4 },
];

const ConsumptionForm: React.FC = () => {
  const cancelToken = useRef<CancelTokenSource | null>(null);
  const isSearching = useRef<boolean>(false);
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const history = useHistory();
  const params = useParams<IConsumptionFormMatchParams>();
  const consumptionId = Number(params.consumptionId);
  const consumptionLoaded = useSelector(
    (state: RootState) => selectConsumptionLoadedById(state, consumptionId),
  );
  const consumption = useSelector(
    (state: RootState) => selectConsumptionById(state, consumptionId),
  );
  const [availableHours, setAvailableHours] = useState<
  {text: string, value: string, key: number}[]>(generateHours());
  const generateBlankConsumption = () => ({
    date: availableHours[availableHours.length - 1].value,
    quantity: 1,
    food: '',
    food_name: '',
    food_icon: '',
    id: 0,
    url: '',
  });
  const [draftConsumption, setDraftConsumption] = useState(
    consumption || generateBlankConsumption(),
  );
  const { goBack } = useHistory();
  const foodsLoading = useSelector(selectFoodsLoading);
  const consumptionsLoading = useSelector(selectConsumptionsLoading);
  const isLoading = foodsLoading || consumptionsLoading;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentFoodSearch, setCurrentFoodSearch] = useState('');
  const debouncedCurrentFoodSearch = useDebounce(currentFoodSearch, 500);
  const [isDeleteVisible, setIsDeleteVisible] = useState(false);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const sections = [
    { name: 'Nutrition', href: '/nutrition' },
    { name: consumptionId ? 'Edit' : 'Log Consumption' },
  ];

  const [foodResults, setFoodResults] = useState<SearchResultProps[]>();

  useEffect(() => {
    if (consumptionId && !consumptionLoaded && !consumption && !isSubmitting && !isLoading) {
      dispatch(fetchConsumption(consumptionId));
    }
  }, [consumptionId, consumptionLoaded, consumption, isSubmitting, isLoading, dispatch]);

  useEffect(() => {
    if (consumption) setDraftConsumption(consumption);
  }, [consumption]);

  const searchFoods = useCallback(async () => {
    if (isSearching.current) {
      cancelToken.current?.cancel('New search requested');
      cancelToken.current = axios.CancelToken.source();
    } else {
      // Work with two variables - isSearchLoading for visible state, and isSearching for internal
      // state to prevent infinite loops. Are React hooks being used incorrectly? This seems like
      // a design pitfall.
      setIsSearchLoading(true);
      isSearching.current = true;
    }
    const { data } = await reqGetAllFoods(debouncedCurrentFoodSearch, cancelToken.current?.token);
    isSearching.current = false;
    setIsSearchLoading(false);
    return data.results;
  }, [cancelToken, debouncedCurrentFoodSearch]);

  useEffect(() => {
    (async () => {
      if (!debouncedCurrentFoodSearch) return;
      const foods = await searchFoods();
      setFoodResults(foods?.map((food: IFood) => ({ // TODO: Avoid using backend directly
        title: food.name,
        id: food.id,
        description: healthStrings[food.health_index - 1],
        url: food.url,
        image: food.icon ? `/img/food_icons/${food.icon}.svg` : '',
      })));
    })();
  }, [debouncedCurrentFoodSearch, cancelToken, searchFoods]);

  const handleHourChange = (event: React.SyntheticEvent<HTMLElement>, { value }: DropdownProps) => {
    setDraftConsumption({ ...draftConsumption, date: String(value) });
  };

  const HourField = () => {
    if (consumptionId) {
      return <Input id="when-input" disabled value={moment(draftConsumption.date).format(TIME_FORMAT_STRING)} />;
    }
    return (
      <Dropdown
        id="when-input"
        selection
        options={availableHours}
        onChange={handleHourChange}
        value={draftConsumption.date}
        disabled={!!consumptionId}
      />
    );
  };

  const handleDelete = () => {
    if (!consumption) return;
    dispatch(deleteConsumption(consumption));
  };

  const handleFormSubmit = async () => {
    if (isLoading) return;
    setIsSubmitting(true);

    if (consumptionId) {
      try {
        await dispatch(updateConsumption(draftConsumption));
        enqueueSnackbar(`Consumption of "${draftConsumption.food_name}" saved`, { variant: 'success' });
        if (history.length > 1) history.goBack();
        else history.push('/nutrition');
      } catch (e) {
        enqueueSnackbar(`Error saving consumption: ${extractError(e)}`, { variant: 'error' });
      }
    } else {
      try {
        await dispatch(createConsumption(draftConsumption));
        setAvailableHours(generateHours());
        setDraftConsumption(generateBlankConsumption());
        setCurrentFoodSearch('');
        enqueueSnackbar(`Well done! Consumption of "${currentFoodSearch}" logged.`, { variant: 'success' });
      } catch (e) {
        enqueueSnackbar(`Error logging consumption: ${extractError(e)}`, { variant: 'error' });
      }
    }
  };

  const handleFoodChange = (e: SyntheticEvent, data: any) => {
    setCurrentFoodSearch(data.result.title);
    setDraftConsumption({ ...draftConsumption, food: data.result.url });
  };

  const handleQuantityChange = (e: React.FormEvent<HTMLInputElement>, { value }: CheckboxProps) => {
    setDraftConsumption({ ...draftConsumption, quantity: Number(value) });
  };

  const handleSearchChange = async (
    event: React.MouseEvent<HTMLElement>, { value }: SearchProps) => {
    const newFoodSearch = value?.toString() ?? '';
    setDraftConsumption({ ...draftConsumption, food: '' });
    setCurrentFoodSearch(newFoodSearch);
  };

  const foodField = consumptionId
    ? (
      <Input
        id="food-input"
        value={draftConsumption.food_name}
        disabled
      />
    )
    : (
      <Search
        id="food-input"
        loading={isSearchLoading}
        onResultSelect={handleFoodChange}
        onSearchChange={handleSearchChange}
        results={foodResults}
        value={currentFoodSearch}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
      />
    );

  return (
    <div>
      <BreadcrumbSet sections={sections} />
      <HeaderBar title={consumptionId ? 'Edit Consumption' : 'Log Consumption'} icon="nutrition" />
      <Form
        loading={isLoading}
        onSubmit={handleFormSubmit}
      >
        <Form.Field>
          <label htmlFor="food-input">Food</label>
          {foodField}
        </Form.Field>
        <Form.Field>
          <label htmlFor="when-input">When</label>
          <HourField />
        </Form.Field>
        <Form.Field>
          <label>Quantity</label>
        </Form.Field>
        {quantities.map((qty) => (
          <Form.Field key={qty.value}>
            <Radio
              label={<label htmlFor={`radio_${qty.value}`}>{qty.text}</label>}
              id={`radio_${qty.value}`}
              name="quantity"
              value={qty.value}
              checked={draftConsumption.quantity === qty.value}
              onChange={handleQuantityChange}
            />
          </Form.Field>
        ))}
        <Divider hidden />
        <Button.Group>
          <Button type="button" onClick={goBack}>Back</Button>
          <Button.Or />
          <Button positive type="submit" disabled={!draftConsumption.food}>
            {consumptionId ? 'Save Log' : 'Submit Log'}
          </Button>
        </Button.Group>
        {consumptionId
          ? (
            <Button
              type="button"
              basic
              floated="right"
              color="red"
              onClick={() => setIsDeleteVisible(false)}
            >
              Delete
            </Button>
          )
          : null}
      </Form>
      <Confirm
        open={isDeleteVisible}
        onCancel={() => setIsDeleteVisible(false)}
        onConfirm={handleDelete}
        header="Delete Consumption?"
        content="This consumption will no longer appear in your history. However, you can add it back later, and points awarded as a result of this Consumption will remain. Please note that the calculation of future points will not take this deletion into account, and will still take it into account."
      />
    </div>
  );
};

export default ConsumptionForm;
