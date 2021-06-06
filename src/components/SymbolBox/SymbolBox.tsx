import React from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete, { AutocompleteChangeDetails, AutocompleteChangeReason, AutocompleteRenderGroupParams } from '@material-ui/lab/Autocomplete';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import ListSubheader from '@material-ui/core/ListSubheader';
import { useTheme, makeStyles } from '@material-ui/core/styles';
import { VariableSizeList, ListChildComponentProps } from 'react-window';
import StockSymbolData from '../../interfaces/StockSymbolData';
import { filteredSymbols } from '../../contexts/StockSymbolsContext';

const LISTBOX_PADDING = 8; // px

function renderRow(props: ListChildComponentProps) { // take the list component clone and add padding to the top
    const { data, index, style } = props;
    return React.cloneElement(data[index], {
        style: {
            ...style,
            top: (style.top as number) + LISTBOX_PADDING
        }
    });
};

const OuterElementContext = React.createContext({});

const OuterElementType = React.forwardRef<HTMLDivElement>((props, ref) => {
    const outerProps = React.useContext(OuterElementContext);
    return <div ref={ref} {...props} {...outerProps}></div>
});

function useResetCache(data: any) {
    const ref = React.useRef<VariableSizeList>(null);
    React.useEffect(() => {
        if (ref.current != null) {
            ref.current.resetAfterIndex(0, true);
        }
    }, [data]);
    return ref;
};

// Adapter for react-window
const ListboxComponent = React.forwardRef<HTMLDivElement>(function ListboxComponent(props, ref) {
    const { children, ...other } = props;
    const itemData = React.Children.toArray(children);
    const theme = useTheme();
    const smUp = useMediaQuery(theme.breakpoints.up('sm'), { noSsr: true });
    const itemCount = itemData.length;
    const itemSize = smUp ? 36 : 48;

    const getChildSize = (child: React.ReactNode) => {
        if (React.isValidElement(child) && child.type === ListSubheader) {
            return 48;
        }
        return itemSize;
    };

    const getHeight = () => {
        if (itemCount > 8) {
            return 8 * itemSize;
        }
        return itemData.map(getChildSize).reduce((a, b) => a + b, 0);
    };

    const gridRef = useResetCache(itemCount);

    return (
        <div ref={ref}>
            <OuterElementContext.Provider value={other}>
                <VariableSizeList
                    itemData={itemData}
                    height={getHeight() + 2 * LISTBOX_PADDING}
                    width="100%"
                    ref={gridRef}
                    outerElementType={OuterElementType}
                    innerElementType="ul"
                    itemSize={(index) => getChildSize(itemData[index])}
                    overscanCount={5}
                    itemCount={itemCount}
                >
                    {renderRow}
                </VariableSizeList>
            </OuterElementContext.Provider>
        </div>
    );

});

const useStyles = makeStyles({
    listbox: {
        boxSizing: 'border-box',
        '& ul': {
            padding: 0,
            margin: 0
        },
    },
});

const renderGroup = (params: AutocompleteRenderGroupParams) => [
    <ListSubheader key={params.key} component="div">
        {params.group}
    </ListSubheader>,
    params.children,
];

export interface SymbolBoxProps {
    value: StockSymbolData;
    onChange?: (event: React.ChangeEvent<{}>, value: StockSymbolData | null, reason: AutocompleteChangeReason, details?: AutocompleteChangeDetails<StockSymbolData> | undefined) => void;
}

export default function SymbolBox(props: SymbolBoxProps) {
    const classes = useStyles();
    const { onChange, value } = props;
    return (
        <Autocomplete
            id="symbol-box"
            style={{ width: 400 }}
            disableListWrap
            classes={classes}
            ListboxComponent={ListboxComponent as React.ComponentType<React.HTMLAttributes<HTMLElement>>}
            renderGroup={renderGroup}
            options={filteredSymbols}
            groupBy={(option) => option.symbol[0]}
            renderInput={(params) => <TextField {...params} variant="outlined" label="Stock Symbol"></TextField>}
            getOptionLabel={({symbol, description}) => `${symbol} - ${description}`}
            onChange={onChange}
            autoSelect
            autoHighlight
            value={value}
        />
    );
};