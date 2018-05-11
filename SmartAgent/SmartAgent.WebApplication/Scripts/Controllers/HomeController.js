app.controller('HomeController', function ($scope, services, $filter, $cookieStore, $timeout) {

    $scope.columns = {};

    $scope.alertOK = false;
    $scope.success = false;
    $scope.failure = false;

    $scope.currentPage = 1;
    $scope.numPerPage = 10;
    $scope.maxSize = 5;
    $scope.totalItems = 3;
    $scope.sort = 'label';
    $scope.dir = 1;

    $scope.pageSelector = [5, 10, 25, 50, 100];

    $scope.showCheckboxes = false;
    $scope.showSearch = false;

    services.getIssues(0, 25, 'id', 1, '').then(function (data) {
        $scope.issues = data.data.tasks;
        $scope.totalItems = data.data.total;
    });

    services.getAllAgents().then(function (data) {
        $scope.agents = data.data.agents;
    });

    services.getFilters().then(function (data) {
        $scope.filters = data.data;
        var json_str = $cookieStore.get('stored_columns');
        if (!json_str) {
            for (i = 0; i < $scope.filters.length; i++) {
                $scope.columns[$scope.filters[i]['name']] = true;
            }
        }
        else {
            $scope.columns = JSON.parse(json_str);
        }
    });
    
    $scope.$watch("currentPage + numPerPage", function () {
        var begin = ($scope.currentPage - 1) * $scope.numPerPage
            , end = $scope.numPerPage;

        services.getIssues(begin, end, $scope.sort, $scope.dir, '').then(function (data) {
            $scope.issues = data.data.tasks;
            $scope.totalItems = data.data.total;
        });
    });

    var orderBy = $filter('orderBy');

    $scope.order = function (predicate, reverse) {
        var begin = ($scope.currentPage - 1) * $scope.numPerPage
            , end = $scope.numPerPage;
        var dir = 1;
        if (reverse === true) dir = 0;

        services.getIssues(begin, end, predicate, dir, '').then(function (data) {
            $scope.issues = data.data.tasks;
            $scope.totalItems = data.data.total;
        });
        $scope.sort = predicate;
        $scope.dir = dir;
    };

    $scope.callAtTimeout = function () {
        $scope.alertOK = false;
        $scope.success = false;
        $scope.failure = false;
    };

    $scope.saveCookie = function () {
        var json_str = JSON.stringify($scope.columns);
        $cookieStore.put('stored_columns', json_str);
        $scope.alertOK = true;
        $timeout(function () { $scope.callAtTimeout(); }, 5000);
    };

    $scope.isUndefinedOrNull = function (val) {
        return typeof val === "undefined" || val === null || val === 0 || val === "";
    };

    $scope.specificSearch = function () {
        var searchStr = '';
        for (i = 0; i < $scope.filters.length; i++) {
            if (!$scope.isUndefinedOrNull($scope.filters[i]['value'])) searchStr += '&' + $scope.filters[i]['name'] + '=' + $scope.filters[i]['value'];
        }
        
        var begin = ($scope.currentPage - 1) * $scope.numPerPage
            , end = $scope.numPerPage;
        services.getIssues(begin, end, $scope.sort, $scope.dir, searchStr).then(function (data) {
            $scope.issues = data.data.tasks;
            $scope.totalItems = data.data.total;
        });
    };

    $scope.emptySearch = function () {
        var begin = ($scope.currentPage - 1) * $scope.numPerPage
            , end = $scope.numPerPage;

        for (i = 0; i < $scope.filters.length; i++) {
            $scope.filters[i]['value'] = '';
        }

        services.getIssues(begin, end, $scope.sort, $scope.dir, '').then(function (data) {
            $scope.issues = data.data.tasks;
            $scope.totalItems = data.data.total;
        });
    };

    $scope.globalSearch = function () {
        var begin = ($scope.currentPage - 1) * $scope.numPerPage
            , end = $scope.numPerPage;

        var searchStr = '&searchG=' + $scope.search;

        services.getIssues(begin, end, $scope.sort, $scope.dir, searchStr).then(function (data) {
            $scope.issues = data.data.tasks;
            $scope.totalItems = data.data.total;
        });
    };

    $scope.openEdit = function (id) {
        services.getSpecificIssue(id).then(function (data) {
            $scope.issue = data.data;
            services.getSpecificAgent($scope.issue.idA).then(function (data) {
                $scope.agent = data.data;
            });
        });
    };

    $scope.submitUpdate = function () {
        $scope.issue.idA = $scope.agent.id;
        var json_str = JSON.stringify($scope.issue);
        services.updateIssue(json_str).then(
            function (response) {
                // success callback
                $scope.success = true;
                $scope.emptySearch();
                $timeout(function () { $scope.callAtTimeout(); }, 5000);
            },
            function (response) {
                // failure callback
                $scope.failure = true;
                $scope.emptySearch();
                $timeout(function () { $scope.callAtTimeout(); }, 5000);
            }
        );
    };
});