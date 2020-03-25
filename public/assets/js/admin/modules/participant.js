App.factory('participantFactory', function (Flash,$filter, $uibModal, $rootScope, API, Helpers) {
    var participantFactory = {

        /**
         * Delete participant
         * @param integer id of participant
         * @return
         **/
        delete: function (id, options) {
            if (Helpers.confirmDelete()) {
                API.DELETE('participant/delete/' + id).then(function () {
                    Flash.create('success', 'تم حذف الجهة المشاركة بنجاح');
                    switch (options.view) {
                        case 'datatable':
                            options.dtInstance.reloadData();
                            break;
                    }
                })
            }
        },
        /**
         * Save participant modal
         * @param integer id
         * @return string
         **/
        saveModal: function (method, id, options) {
            $uibModal.open({
                backdrop: 'static',
                templateUrl: Helpers.getTemp('participant/participant-save-modal'),
                size: 'sm',
                controller: function ($uibModalInstance, $scope, Flash, Helpers, API, $route, $filter) {
                    $scope.participant_save_modal = {
                        data: {},
                        method: method,
                        cancel: function () {
                            $uibModalInstance.close();
                        },
                        getParticipant: function () {
                            $scope.participant_save_modal.isLoading = true;
                            API.GET('participant/show/' + id).then(function (d) {
                                $scope.participant_save_modal.isLoading = false;
                                $scope.participant_save_modal.data = d.data;
                            });
                        },
                        onSave: function (Form) {
                            $scope.participant_save_modal.isSendClicked = true;
                            if (!Helpers.isValid(Form.$valid)) {
                                Flash.create('danger', $filter('lang')('check_required_fields'));
                                return false;
                            }
                            $scope.participant_save_modal.isSending = true;
                            var saveParticipantCall = (method == 'add') ? API.POST('participant/add', $scope.participant_save_modal.data) : API.PUT('participant/update/' + $scope.participant_save_modal.data.id, $scope.participant_save_modal.data);
                            saveParticipantCall.then(function (d) {
                                $scope.participant_save_modal.isSending = false;
                                if (options && options.view == 'datatable') {
                                    options.dtInstance.reloadData();
                                }
                                $scope.participant_save_modal.cancel();
                            });
                        },
                        init: function () {
                            if (id) {
                                $scope.participant_save_modal.getParticipant();
                            }
                        }
                    };
                    $scope.participant_save_modal.init();
                }
            });
        },
        /**
         * Show participant details modal
         * @param integer id
         * @return string
         **/
        showModal: function (id, options) {
            $uibModal.open({
                backdrop: 'static',
                templateUrl: Helpers.getTemp('participant/participant-show-modal'),
                size: 'lg',
                controller: function ($uibModalInstance, $scope, Flash, Helpers, API, $route, $filter) {
                    $scope.participant_details_modal = {
                        filter: {
                            holy_place_id: 'all',
                            subject_id: 'all',
                            sub_subject_id: 'all',
                            level_id: 'all',
                            geographical_scope_id: 'all'
                        },
                        data: {},
                        lists: {},
                        currentTab: {},
                        setCurrentTab: function (tab) {
                            $scope.participant_details_modal.currentTab = tab;
                        },
                        cancel: function () {
                            $uibModalInstance.close();
                        },
                        getParticipant: function () {
                            $scope.participant_details_modal.isLoading = true;
                            API.GET('participant/details/' + id).then(function (d) {
                                $scope.participant_details_modal.isLoading = false;
                                $scope.participant_details_modal.data = d.data;
                                $scope.participant_details_modal.prepareRequirements();
                            });
                        },
                        prepareLists: function(){
                            // Add (All) option to filter lists
                            $rootScope.$watch('main_lists', function (n) {
                                angular.forEach($rootScope.main_lists, function (main_list_item, main_list_key) {
                                    if (['holy_places', 'subjects', 'sub_subjects', 'levels', 'geographical_scopes'].indexOf(main_list_key) > -1) {
                                        $scope.participant_details_modal.lists[main_list_key] = angular.copy(main_list_item);
                                        $scope.participant_details_modal.lists[main_list_key].unshift({
                                            id: 'all',
                                            name: 'الكل'
                                        });
                                    }
                                });
                            }, true);
                        },
                        prepareRequirements: function () {
                            var filterParams = {};
                            angular.forEach($scope.participant_details_modal.filter,function(filterVal,filterKey) {
                                if (filterVal && filterVal != 'all') {
                                    filterParams[filterKey] = filterVal;
                                }
                            });
                            $scope.participant_details_modal.requirements = $filter('filter')($scope.participant_details_modal.data.requirements, filterParams,true);
                        },
                        preparePrintUrl: function () {
                            if ($scope.participant_details_modal.data.participant) {
                                var urlParams = "";
                                angular.forEach($scope.participant_details_modal.filter, function (filterVal, filterKey) {
                                    if (filterVal && filterVal != 'all') {
                                        if (urlParams != "") {
                                            urlParams += "&";
                                        }
                                        urlParams += filterKey + "=" + encodeURIComponent(filterVal);
                                    }
                                });
                                urlParams = (urlParams) ? '?' + urlParams : '';
                                return $rootScope.baseUrl + '/print/participant/' + $scope.participant_details_modal.data.participant.id + urlParams;
                            }else {
                                return '';
                            }

                        },
                        init: function () {
                            $scope.participant_details_modal.prepareLists();
                            if (id) {
                                $scope.participant_details_modal.getParticipant();
                            }
                        }
                    };
                    $scope.participant_details_modal.init();
                }
            });
        },
        /**
         * Delete requirement
         * @param integer id of requirement
         * @return
         **/
        deleteRequirement: function (id, options) {
            if (Helpers.confirmDelete()) {
                API.DELETE('participant/requirement/delete/' + id).then(function () {
                    Flash.create('success', 'تم حذف المتطلب بنجاح');
                    switch (options.view) {
                        case 'datatable':
                            options.dtInstance.reloadData();
                            break;
                    }
                })
            }
        },
        /**
         * Save requirement modal
         * @param integer id
         * @return string
         **/
        saveRequirementModal: function (method, id, options) {
            $uibModal.open({
                backdrop: 'static',
                templateUrl: Helpers.getTemp('participant/requirement-modal'),
                size: 'lg',
                controller: function ($uibModalInstance, $rootScope, $scope, Flash,$filter, Helpers, API, $route, $filter) {
                    $scope.requirement_modal = {
                        data: {},
                        method: method,
                        cancel: function () {
                            $uibModalInstance.close();
                        },
                        getRequirement: function () {
                            $scope.requirement_modal.isLoading = true;
                            API.GET('participant/requirement/show/' + id).then(function (d) {
                                $scope.requirement_modal.isLoading = false;
                                $scope.requirement_modal.data = d.data;
                                $scope.requirement_modal.prepareSelectedParticipants();
                            });
                        },
                        participantsOrder: function (participant) {
                            return $scope.requirement_modal.selected_participants[participant.id] == true;
                        },
                        selectAll: function (status) {
                            if (!$scope.requirement_modal.selected_participants) {
                                $scope.requirement_modal.selected_participants = {};
                            }
                            var newSelectedVals = {};
                            angular.forEach($rootScope.main_lists.participants, function (p_v,p_k) {
                                if (p_v.id) {
                                    if (status) {
                                        newSelectedVals[p_v.id] = true;
                                    } else {
                                        newSelectedVals[p_v.id] = false;
                                    }
                                }
                            });
                            $scope.requirement_modal.selected_participants = newSelectedVals;
                            
                        },
                        getSelected: function () {
                            var getSelectedResult = [];
                            if (method == 'add') {
                                angular.forEach($scope.requirement_modal.selected_participants, function (p_selected_val, p_selected_key) {
                                    if (p_selected_val) {
                                        getSelectedResult.push(parseInt(p_selected_key));
                                    }
                                });
                            }else {
                                angular.forEach($scope.requirement_modal.selected_participants, function (p_selected_val, p_selected_key) {
                                    var isCurrentParticipantExists = false;
                                    angular.forEach($scope.requirement_modal.data.participants, function (pv, pk) {
                                        if (parseInt(p_selected_key) == pv.participant_id) {
                                            isCurrentParticipantExists = true;
                                        }
                                    });
                                    if (!isCurrentParticipantExists) {
                                        getSelectedResult.push(parseInt(p_selected_key));
                                    }
                                });
                            }

                            return getSelectedResult;
                        },
                        getActualSelected: function () {
                            var getSelectedResult = [];
                            angular.forEach($scope.requirement_modal.selected_participants, function (p_selected_val, p_selected_key) {
                                if (p_selected_val) {
                                    getSelectedResult.push(parseInt(p_selected_key));
                                }
                            });
                            return getSelectedResult;
                        },
                        getDeleted: function () {
                            var getDeletedResult = [];
                            angular.forEach($scope.requirement_modal.data.participants, function (pv, pk) {
                                if ($scope.requirement_modal.selected_participants[pv.participant_id] === false) {
                                    getDeletedResult.push(pv.participant_id);
                                }
                            });
                            return getDeletedResult;
                        },
                        isSelelectedAll: function () {
                            if (!$scope.requirement_modal.selected_participants) {
                                $scope.requirement_modal.selected_participants = {};
                            }
                            var isSelelectedAll = false;

                            if ($rootScope.main_lists.participants && ($rootScope.main_lists.participants.length == $scope.requirement_modal.getActualSelected().length)) {
                                isSelelectedAll = true;
                            }
                            return isSelelectedAll;
                        },
                        prepareSelectedParticipants: function () {
                            var setSelectedParticipants = {};
                            if ($scope.requirement_modal.data.participants && $scope.requirement_modal.data.participants.length) {
                                angular.forEach($scope.requirement_modal.data.participants, function (pv, pk) {
                                    setSelectedParticipants[pv.participant_id] = true;
                                });
                            }
                            $scope.requirement_modal.selected_participants = setSelectedParticipants;
                        },
                        getLists: function () {
                            if (!$rootScope.main_lists.participants) {
                                $scope.requirement_modal.isListsLoading = true;
                                API.GET('helpers/list/requirement-lists').then(function (d) {
                                    $scope.requirement_modal.isListsLoading = false;
                                    $rootScope.main_lists.participants = d.data.participants;
                                });
                            }
                        },
                        onSave: function (Form, isNew) {
                            $scope.requirement_modal.isSendClicked = true;
                            if (!Helpers.isValid(Form.$valid)) {
                                Flash.create('danger', $filter('lang')('check_required_fields'));
                                return false;
                            } else if (method == 'add' && !$scope.requirement_modal.getSelected().length) {
                                Flash.create('danger','يرجى أختيار جهة مشاركة واحدة على الأقل');
                                return false;
                            }
                            $scope.requirement_modal.isSending = true;
                            $scope.requirement_modal.data.selected_participants = $scope.requirement_modal.getSelected();
                            $scope.requirement_modal.data.deleted_participants = $scope.requirement_modal.getDeleted();
                            var sendParticipantData = angular.copy($scope.requirement_modal.data);
                            delete sendParticipantData.participants;
                            var saveRequirementCall = (method == 'add') ? API.POST('participant/requirement/add', sendParticipantData) : API.PUT('participant/requirement/update/' + $scope.requirement_modal.data.id, sendParticipantData);
                            saveRequirementCall.then(function (d) {
                                $scope.requirement_modal.isSending = false;
                                if(angular.isObject(d) && d.data && d.data.message == 'success'){
                                    if (options && options.view == 'datatable') {
                                        options.dtInstance.reloadData();
                                    }
                                    if (isNew) {
                                        Flash.create('success','تمت إضافة المتطلب بنجاح');
                                        $scope.requirement_modal.data = {};
                                    } else {
                                        $scope.requirement_modal.cancel();
                                    }
                                }else {
                                    Flash.create('danger','حدث خطأ, يرجى إعادة المحاولة');
                                }
                            });
                        },
                        init: function () {
                            $scope.requirement_modal.getLists();
                            if (id) {
                                $scope.requirement_modal.getRequirement();
                            }
                        }
                    };
                    $scope.requirement_modal.init();
                }
            });
        },
    };
    return participantFactory;
});
