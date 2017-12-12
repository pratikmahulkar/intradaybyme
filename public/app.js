var app = angular.module('app', ['ngTouch', 'ui.grid', 'ui.grid.cellNav', 'ui.grid.edit', 'ui.grid.resizeColumns', 'ui.grid.pinning', 'ui.grid.selection', 'ui.grid.moveColumns', 'ui.grid.exporter', 'ui.grid.importer', 'ui.grid.grouping']);

app.controller('MainCtrl', ['$scope', '$http', '$timeout', '$interval', 'uiGridConstants', 'uiGridGroupingConstants', '$filter', '$location',
    function ($scope, $http, $timeout, $interval, uiGridConstants, uiGridGroupingConstants, $filter, $location) {
        var gridApi;
        $scope.selectedRows = [];
        $scope.gridApi;
        $scope.selectedDate = new Date();
        $scope.gridOptions = {
            data: 'myData',
            enableCellEditOnFocus: true,
            enableColumnResizing: true,
            enableFiltering: true,
            enableGridMenu: true,
            showGridFooter: true,
            showColumnFooter: true,
            fastWatch: true,
            rowIdentity: getRowId,
            getRowIdentity: getRowId,
            importerDataAddCallback: function importerDataAddCallback(grid, newObjects) {
                $scope.myData = $scope.data.concat(newObjects);
            },
            columnDefs: [{
                name: 'SYMBOL'
            },
                {
                    name: 'CLOSE',
                    type: 'number',
                    headerCellClass: "highlight",
                    cellClass: "highlight",
                    filters: [{
                        condition: uiGridConstants.filter.GREATER_THAN,
                        placeholder: 'greater than',
                        term: "101"
                    },
                        {
                            condition: uiGridConstants.filter.LESS_THAN,
                            placeholder: 'less than'
                        }
                    ]
                },
                {
                    name: 'PIVOT',
                    type: 'number',
                    headerCellClass: "highlight",
                    cellClass: "highlight",
                    field: 'PIVOT',
                    //cellTemplate: '<div class="ui-grid-cell-contents"><span>{{ grid.appScope.getPivot(row.entity) }}</span></div>', 
                    filters: [{
                        condition: uiGridConstants.filter.GREATER_THAN,
                        placeholder: 'greater than'
                    },
                        {
                            condition: uiGridConstants.filter.LESS_THAN,
                            placeholder: 'less than'
                        }
                    ]
                },
                {
                    name: 'DIFF',
                    type: 'number',
                    field: 'DIFF',
                    filters: [{
                        condition: uiGridConstants.filter.GREATER_THAN,
                        placeholder: 'greater than',
                        term: "1"
                    },
                        {
                            condition: uiGridConstants.filter.LESS_THAN,
                            placeholder: 'less than'
                        }
                    ]
                },
                {
                    name: 'DIFF%',
                    type: 'number',
                    field: 'DIFFPer',
                    filters: [{
                        condition: uiGridConstants.filter.GREATER_THAN,
                        placeholder: 'greater than'

                    },
                        {
                            condition: uiGridConstants.filter.LESS_THAN,
                            placeholder: 'less than'
                        }
                    ]
                },
                {
                    name: 'ACTION'
                },
                {
                    name: 'S1',
                    type: 'number',
                    field: 'S1',
                    filters: [{
                        condition: uiGridConstants.filter.GREATER_THAN,
                        placeholder: 'greater than'
                    },
                        {
                            condition: uiGridConstants.filter.LESS_THAN,
                            placeholder: 'less than'
                        }
                    ]
                },
                {
                    name: 'R1',
                    type: 'number',
                    field: 'R1',
                    filters: [{
                        condition: uiGridConstants.filter.GREATER_THAN,
                        placeholder: 'greater than'
                    },
                        {
                            condition: uiGridConstants.filter.LESS_THAN,
                            placeholder: 'less than'
                        }
                    ]
                },
            //                {
            //                    name: 'BUY',
            //                    type: 'number',
            //                    filters: [{
            //                        condition: uiGridConstants.filter.GREATER_THAN,
            //                        placeholder: 'greater than'
            //                    },
            //                        {
            //                            condition: uiGridConstants.filter.LESS_THAN,
            //                            placeholder: 'less than'
            //                        }
            //                    ]
            //                },
            //                {
            //                    name: 'SELL',
            //                    type: 'number',
            //                    filters: [{
            //                        condition: uiGridConstants.filter.GREATER_THAN,
            //                        placeholder: 'greater than'
            //                    },
            //                        {
            //                            condition: uiGridConstants.filter.LESS_THAN,
            //                            placeholder: 'less than'
            //                        }
            //                    ]
            //                },
            //                {
            //                    name: 'STOPLOSS',
            //                    type: 'number',
            //                    filters: [{
            //                        condition: uiGridConstants.filter.GREATER_THAN,
            //                        placeholder: 'greater than'
            //                    },
            //                        {
            //                            condition: uiGridConstants.filter.LESS_THAN,
            //                            placeholder: 'less than'
            //                        }
            //                    ]
            //                },
                {
                name: 'TOTTRDQTY',
                type: 'number',
                enableCellEdit: true,
                sort: {
                    direction: uiGridConstants.DESC,
                    priority: 0
                },
                aggregationType: uiGridConstants.aggregationTypes.avg,
                treeAggregationType: uiGridGroupingConstants.aggregation.AVG,
                filters: [{
                    condition: uiGridConstants.filter.GREATER_THAN,
                    placeholder: 'greater than'
                },
                        {
                            condition: uiGridConstants.filter.LESS_THAN,
                            placeholder: 'less than'
                        }
                    ]
            },
                {
                    name: 'TOTTRDVAL',
                    enableCellEdit: true,
                    type: 'number',
                    aggregationType: uiGridConstants.aggregationTypes.avg,
                    treeAggregationType: uiGridGroupingConstants.aggregation.AVG,
                    filters: [{
                        condition: uiGridConstants.filter.GREATER_THAN,
                        placeholder: 'greater than'
                    },
                        {
                            condition: uiGridConstants.filter.LESS_THAN,
                            placeholder: 'less than'
                        }
                    ]
                }
            //{ name: 'TIMESTAMP' },
            //{ name: 'TOTALTRADES', enableCellEdit: true, aggregationType: uiGridConstants.aggregationTypes.avg, treeAggregationType: uiGridGroupingConstants.aggregation.AVG }


            //      { name: 'age', width: 100, enableCellEdit: true, aggregationType: uiGridConstants.aggregationTypes.avg, treeAggregationType: uiGridGroupingConstants.aggregation.AVG },
            //      { name: 'address.street', width: 150, enableCellEdit: true },
            //      { name: 'address.city', width: 150, enableCellEdit: true },
            //      { name: 'address.state', width: 50, enableCellEdit: true },
            //      { name: 'address.zip', width: 50, enableCellEdit: true },
            //      { name: 'company', width: 100, enableCellEdit: true },
            //      { name: 'email', width: 100, enableCellEdit: true },
            //      { name: 'phone', width: 200, enableCellEdit: true },
            //      { name: 'about', width: 300, enableCellEdit: true },
            //      { name: 'friends[0].name', displayName: '1st friend', width: 150, enableCellEdit: true },
            //      { name: 'friends[1].name', displayName: '2nd friend', width: 150, enableCellEdit: true },
            //      { name: 'friends[2].name', displayName: '3rd friend', width: 150, enableCellEdit: true },
            //      { name: 'agetemplate', field: 'age', width: 150, cellTemplate: '<div class="ui-grid-cell-contents"><span>Age 2:{{COL_FIELD}}</span></div>' },
            //      { name: 'Is Active', field: 'isActive', width: 150, type: 'boolean' },
            //      { name: 'Join Date', field: 'registered', cellFilter: 'date', width: 150, type: 'date', enableFiltering: false },
            //{name: 'Month Joined', field: 'registered', cellFilter: 'date:"MMMM"', filterCellFiltered: true, sortCellFiltered: true, width: 150, type: 'date' }
            ],
            onRegisterApi: function onRegisterApi(registeredApi) {
                $scope.gridApi = registeredApi;
            }
        };

        $scope.gridOptions1 = {
            data: 'selectedRows',
            enableCellEditOnFocus: true,
            enableColumnResizing: true,
            enableFiltering: true,
            enableGridMenu: true,
            showGridFooter: true,
            showColumnFooter: true,
            fastWatch: true,
            rowIdentity: getRowId,
            getRowIdentity: getRowId,
            importerDataAddCallback: function importerDataAddCallback(grid, newObjects) {
                $scope.myData = $scope.data.concat(newObjects);
            },
            columnDefs: [{
                name: 'SYMBOL'
            },
            //{ name: 'SERIES' },

            //{ name: 'OPEN' },
            //      {name: 'HIGH', type: 'number', filters: [
            //        {
            //            condition: uiGridConstants.filter.GREATER_THAN,
            //            placeholder: 'greater than'
            //        },
            //        {
            //            condition: uiGridConstants.filter.LESS_THAN,
            //            placeholder: 'less than'
            //        }]
            //  },
            //      { name: 'LOW', type: 'number', filters: [
            //        {
            //            condition: uiGridConstants.filter.GREATER_THAN,
            //            placeholder: 'greater than'//,
            //            //term: '2'
            //        },
            //        {
            //            condition: uiGridConstants.filter.LESS_THAN,
            //            placeholder: 'less than'
            //        }]
            //      },
                {
                name: 'CLOSE',
                type: 'number',
                headerCellClass: "highlight",
                cellClass: "highlight",
                filters: [{
                    condition: uiGridConstants.filter.GREATER_THAN,
                    placeholder: 'greater than'
                },
                        {
                            condition: uiGridConstants.filter.LESS_THAN,
                            placeholder: 'less than'
                        }
                    ]
            },
            //{ name: 'LAST' },
            //{ name: 'PREVCLOSE' },
                {
                name: 'PIVOT',
                type: 'number',
                headerCellClass: "highlight",
                cellClass: "highlight",
                field: 'PIVOT',
                //cellTemplate: '<div class="ui-grid-cell-contents"><span>{{ grid.appScope.getPivot(row.entity) }}</span></div>', 
                filters: [{
                    condition: uiGridConstants.filter.GREATER_THAN,
                    placeholder: 'greater than'
                },
                        {
                            condition: uiGridConstants.filter.LESS_THAN,
                            placeholder: 'less than'
                        }
                    ]
            },

                {
                    name: 'DIFF',
                    type: 'number',
                    field: 'DIFF',
                    filters: [{
                        condition: uiGridConstants.filter.GREATER_THAN,
                        placeholder: 'greater than',
                        term: "1"
                    },
                        {
                            condition: uiGridConstants.filter.LESS_THAN,
                            placeholder: 'less than'
                        }
                    ]
                },

                {
                    name: 'DIFF%',
                    type: 'number',
                    field: 'DIFFPer',
                    filters: [{
                        condition: uiGridConstants.filter.GREATER_THAN,
                        placeholder: 'greater than',
                        term: "1"
                    },
                        {
                            condition: uiGridConstants.filter.LESS_THAN,
                            placeholder: 'less than'
                        }
                    ]
                },
                {
                    name: 'ACTION'
                },
                {
                    name: 'S1',
                    type: 'number',
                    field: 'S1',
                    filters: [{
                        condition: uiGridConstants.filter.GREATER_THAN,
                        placeholder: 'greater than'
                    },
                        {
                            condition: uiGridConstants.filter.LESS_THAN,
                            placeholder: 'less than'
                        }
                    ]
                },
                {
                    name: 'R1',
                    type: 'number',
                    field: 'R1',
                    filters: [{
                        condition: uiGridConstants.filter.GREATER_THAN,
                        placeholder: 'greater than'
                    },
                        {
                            condition: uiGridConstants.filter.LESS_THAN,
                            placeholder: 'less than'
                        }
                    ]
                },
                {
                    name: 'BUY',
                    type: 'number',
                    filters: [{
                        condition: uiGridConstants.filter.GREATER_THAN,
                        placeholder: 'greater than'
                    },
                        {
                            condition: uiGridConstants.filter.LESS_THAN,
                            placeholder: 'less than'
                        }
                    ]
                },
                {
                    name: 'SELL',
                    type: 'number',
                    filters: [{
                        condition: uiGridConstants.filter.GREATER_THAN,
                        placeholder: 'greater than'
                    },
                        {
                            condition: uiGridConstants.filter.LESS_THAN,
                            placeholder: 'less than'
                        }
                    ]
                },
                {
                    name: 'STOPLOSS',
                    type: 'number',
                    filters: [{
                        condition: uiGridConstants.filter.GREATER_THAN,
                        placeholder: 'greater than'
                    },
                        {
                            condition: uiGridConstants.filter.LESS_THAN,
                            placeholder: 'less than'
                        }
                    ]
                }
            //                ,
            //                {
            //                    name: 'TOTTRDQTY',
            //                    type: 'number',
            //                    enableCellEdit: true,
            //                    sort: {
            //                        direction: uiGridConstants.DESC,
            //                        priority: 0
            //                    },
            //                    aggregationType: uiGridConstants.aggregationTypes.avg,
            //                    treeAggregationType: uiGridGroupingConstants.aggregation.AVG,
            //                    filters: [{
            //                        condition: uiGridConstants.filter.GREATER_THAN,
            //                        placeholder: 'greater than'
            //                    },
            //                        {
            //                            condition: uiGridConstants.filter.LESS_THAN,
            //                            placeholder: 'less than'
            //                        }
            //                    ]
            //                },
            //                {
            //                    name: 'TOTTRDVAL',
            //                    enableCellEdit: true,
            //                    type: 'number',
            //                    aggregationType: uiGridConstants.aggregationTypes.avg,
            //                    treeAggregationType: uiGridGroupingConstants.aggregation.AVG,
            //                    filters: [{
            //                        condition: uiGridConstants.filter.GREATER_THAN,
            //                        placeholder: 'greater than'
            //                    },
            //                        {
            //                            condition: uiGridConstants.filter.LESS_THAN,
            //                            placeholder: 'less than'
            //                        }
            //                    ]
            //                }
            //{ name: 'TIMESTAMP' },
            //{ name: 'TOTALTRADES', enableCellEdit: true, aggregationType: uiGridConstants.aggregationTypes.avg, treeAggregationType: uiGridGroupingConstants.aggregation.AVG }
            //      { name: 'age', width: 100, enableCellEdit: true, aggregationType: uiGridConstants.aggregationTypes.avg, treeAggregationType: uiGridGroupingConstants.aggregation.AVG },
            //      { name: 'address.street', width: 150, enableCellEdit: true },
            //      { name: 'address.city', width: 150, enableCellEdit: true },
            //      { name: 'address.state', width: 50, enableCellEdit: true },
            //      { name: 'address.zip', width: 50, enableCellEdit: true },
            //      { name: 'company', width: 100, enableCellEdit: true },
            //      { name: 'email', width: 100, enableCellEdit: true },
            //      { name: 'phone', width: 200, enableCellEdit: true },
            //      { name: 'about', width: 300, enableCellEdit: true },
            //      { name: 'friends[0].name', displayName: '1st friend', width: 150, enableCellEdit: true },
            //      { name: 'friends[1].name', displayName: '2nd friend', width: 150, enableCellEdit: true },
            //      { name: 'friends[2].name', displayName: '3rd friend', width: 150, enableCellEdit: true },
            //      { name: 'agetemplate', field: 'age', width: 150, cellTemplate: '<div class="ui-grid-cell-contents"><span>Age 2:{{COL_FIELD}}</span></div>' },
            //      { name: 'Is Active', field: 'isActive', width: 150, type: 'boolean' },
            //      { name: 'Join Date', field: 'registered', cellFilter: 'date', width: 150, type: 'date', enableFiltering: false },
            //{name: 'Month Joined', field: 'registered', cellFilter: 'date:"MMMM"', filterCellFiltered: true, sortCellFiltered: true, width: 150, type: 'date' }
            ],
            onRegisterApi: function onRegisterApi(registeredApi) {
                $scope.selectedRows = registeredApi;
            }
        };

        function getRowId(row) {
            return row.id;
        }
        $scope.getPivot = function (entity) {
            return ((parseFloat(entity.LOW) + parseFloat(entity.CLOSE) + parseFloat(entity.HIGH)) / 3).toFixed(2);
        };
        $scope.toggleFilterRow = function () {
            $scope.gridOptions.enableFiltering = !$scope.gridOptions.enableFiltering;
            gridApi.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
        };
        $scope.calculateS1 = function (entity) {
            return (this.getPivot(entity) * 2 - entity.HIGH).toFixed(2);
        };
        $scope.calculateR1 = function (entity) {
            return (this.getPivot(entity) * 2 - entity.LOW).toFixed(2);
        };
        $scope.getSelecetdRows = function () {
            $scope.selectedRows = $scope.gridApi.selection.getSelectedRows();
        };
        var i = 0;
        $scope.getFormattedDate = function ($scope) {
            var formattedDate = "";
            var months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
            formattedDate = $scope.selectedDate.getDate() < 10 ? "0" + $scope.selectedDate.getDate() : $scope.selectedDate.getDate();
            formattedDate += months[$scope.selectedDate.getMonth()];
            formattedDate += $scope.selectedDate.getFullYear();
            return $scope.selectedDate;
        };
        $scope.refreshData = function () {
            $scope.myData = [];
            $scope.selectedRows = [];
            $scope.AVGTOTTRDVAL = 0;
            $scope.AVGTOTTRDQTY = 0;
            var formattedDate = $scope.getFormattedDate($scope);
            var start = new Date();

            $http.get($location.absUrl() + 'api/' + formattedDate)
                .success(function (data) {
                    data.forEach(function (row) {
                        row.id = i;
                        i++;
                        row.HIGH = parseFloat(row.HIGH);
                        row.LOW = parseFloat(row.LOW);
                        row.CLOSE = parseFloat(row.CLOSE);
                        row.TOTTRDVAL = parseFloat(row.TOTTRDVAL);
                        row.TOTTRDQTY = parseFloat(row.TOTTRDQTY);
                        row.PIVOT = parseFloat($scope.getPivot(row));
                        row.DIFF = parseFloat((Math.abs(row.CLOSE - row.PIVOT) / row.CLOSE * 100).toFixed(2));
                        row.ACTION = row.CLOSE - row.PIVOT < 0 ? "SELL" : "BUY";
                        row.S1 = parseFloat($scope.calculateS1(row));
                        row.R1 = parseFloat($scope.calculateR1(row));
                        if (row.ACTION == "SELL")
                            row.DIFFPer = parseFloat(((row.CLOSE - row.S1) / row.CLOSE * 100).toFixed(2));
                        else
                            row.DIFFPer = parseFloat(((row.R1 - row.CLOSE) / row.CLOSE * 100).toFixed(2));

                        $scope.myData.push(row);
                        $scope.AVGTOTTRDVAL += isNaN(row.TOTTRDVAL) ? 0 : parseFloat(row.TOTTRDVAL);
                        $scope.AVGTOTTRDQTY += isNaN(row.TOTTRDQTY) ? 0 : parseFloat(row.TOTTRDQTY);
                    });

                    $scope.AVGTOTTRDVAL = ($scope.AVGTOTTRDVAL / data.length).toFixed(2);
                    $scope.AVGTOTTRDQTY = ($scope.AVGTOTTRDQTY / data.length).toFixed(2);
                })
                .error(function (error) {
                    //$scope.callsPending--;
                });

            $scope.$on('$destroy', function () {
                $timeout.cancel(timeout);
                $interval.cancel(sec);
            });
        };
        //$scope.refreshData();
    }
]);